import PrintBarcode from '@/components/PrintTemplate/Barcode';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { exportNhanMaGay } from '@/services/SachTaiLieu/AnPham';
import { resetFieldsForm } from '@/utils/utils';
import { ReloadOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, Modal, Radio, Row, Space } from 'antd';
import fileDownload from 'js-file-download';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useIntl } from 'umi';
import TimKiemInMaVach from './components/TimKiem';

const InMaVachPage = () => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const kieuIn: 'maTaiLieu' | 'dkcb' | 'cuThe' = Form.useWatch('kieuIn', form);
	const tuMaTaiLieu: string = Form.useWatch('tuMaTaiLieu', form);
	const denMaTaiLieu: string = Form.useWatch('denMaTaiLieu', form);
	const tudkcb: string = Form.useWatch('tudkcb', form);
	const dendkcb: string = Form.useWatch('dendkcb', form);
	const madkcb: string = Form.useWatch('madkcb', form);
	const [visibleTimKiem, setVisibleTimKiem] = useState<boolean>(false);
	const [field, setField] = useState<string>('');
	const [loadingExport, setLoadingExport] = useState<boolean>(false);
	const componentRef = useRef(null);

	const handlePrintBarcord = useReactToPrint({ contentRef: componentRef });

	useEffect(() => {
		form.setFieldsValue({ kieuIn: 'maTaiLieu' });
	}, []);

	const generateBarcodeRange = (start: string, end: string): string[] => {
		const matchStart = start.match(/(\D*)(\d+)/);
		const matchEnd = end.match(/(\D*)(\d+)/);
		if (!matchStart || !matchEnd || matchStart[1] !== matchEnd[1]) return [];

		const prefix = matchStart[1];
		const startNum = parseInt(matchStart[2], 10);
		const endNum = parseInt(matchEnd[2], 10);
		const padding = Math.max(matchStart[2].length, matchEnd[2].length);

		return Array.from(
			{ length: endNum - startNum + 1 },
			(_, i) => prefix + (startNum + i).toString().padStart(padding, '0'),
		);
	};

	const listBarcodes = useMemo(() => {
		if (kieuIn === 'maTaiLieu' && tuMaTaiLieu && denMaTaiLieu) {
			return generateBarcodeRange(tuMaTaiLieu, denMaTaiLieu);
		}
		if (kieuIn === 'dkcb' && tudkcb && dendkcb) {
			return generateBarcodeRange(tudkcb, dendkcb);
		}
		if (kieuIn === 'cuThe' && madkcb) {
			return madkcb
				.split(',')
				.map((item) => item.trim())
				.filter((item) => item);
		}
		return [];
	}, [kieuIn, tuMaTaiLieu, denMaTaiLieu, tudkcb, dendkcb, madkcb]);

	const handleExport = () => {
		setLoadingExport(true);

		if (listBarcodes.length === 0) {
			return Promise.reject(intl.formatMessage({ id: 'sachtailieu.inmavach.khongCoMaVachDeIn' }));
		} else {
			return exportNhanMaGay(
				kieuIn === 'maTaiLieu'
					? { danhSachMaTaiLieu: listBarcodes, danhSachSoDangKyCaBiet: [] }
					: { danhSachSoDangKyCaBiet: listBarcodes, danhSachMaTaiLieu: [] },
			)
				.then((res) => {
					fileDownload(res.data, 'Danh sách nhãn mã gáy.docx');
				})
				.catch((error) => console.error('Export failed:', error))
				.finally(() => {
					setLoadingExport(false);
				});
		}
	};

	return (
		<Card title={intl.formatMessage({ id: 'sachtailieu.inMaVach' })}>
			<Form form={form} layout='vertical'>
				<Row gutter={[12, 12]}>
					<Col span={24}>
						<Form.Item name='kieuIn'>
							<Radio.Group
								options={[
									{ value: 'maTaiLieu', label: intl.formatMessage({ id: 'sachtailieu.maTaiLieu' }) },
									{ value: 'dkcb', label: intl.formatMessage({ id: 'sachtailieu.dkcb' }) },
									{ value: 'cuThe', label: intl.formatMessage({ id: 'sachtailieu.cuThe' }) },
								]}
							/>
						</Form.Item>
					</Col>
					<Col span={24}>
						{kieuIn === 'maTaiLieu' ? (
							<Row gutter={[12, 0]}>
								<Col span={12}>
									<Form.Item
										name='tuMaTaiLieu'
										label={intl.formatMessage({ id: 'sachtailieu.inmavach.tuMaTaiLieu' })}
										extra={
											<a
												onClick={() => {
													setField('tuMaTaiLieu');
													setVisibleTimKiem(true);
												}}
											>
												{intl.formatMessage({ id: 'sachtailieu.anpham.timKiem' })}
											</a>
										}
									>
										<Input placeholder={intl.formatMessage({ id: 'sachtailieu.inmavach.nhapMaTaiLieu' })} />
									</Form.Item>
								</Col>
								<Col span={12}>
									<Form.Item
										name='denMaTaiLieu'
										label={intl.formatMessage({ id: 'sachtailieu.inmavach.denMaTaiLieu' })}
										extra={
											<a
												onClick={() => {
													setField(denMaTaiLieu);
													setVisibleTimKiem(true);
												}}
											>
												{intl.formatMessage({ id: 'sachtailieu.anpham.timKiem' })}
											</a>
										}
									>
										<Input placeholder={intl.formatMessage({ id: 'sachtailieu.inmavach.nhapMaTaiLieu' })} />
									</Form.Item>
								</Col>
							</Row>
						) : kieuIn === 'dkcb' ? (
							<Row gutter={[12, 0]}>
								<Col span={12}>
									<Form.Item
										name='tudkcb'
										label={intl.formatMessage({ id: 'sachtailieu.inmavach.tuDangKyCaBiet' })}
										extra={
											<a
												onClick={() => {
													setField('tudkcb');
													setVisibleTimKiem(true);
												}}
											>
												{intl.formatMessage({ id: 'sachtailieu.anpham.timKiem' })}
											</a>
										}
									>
										<Input placeholder={intl.formatMessage({ id: 'sachtailieu.inmavach.nhapDangKyCaBiet' })} />
									</Form.Item>
								</Col>
								<Col span={12}>
									<Form.Item
										name='dendkcb'
										label={intl.formatMessage({ id: 'sachtailieu.inmavach.denDangKyCaBiet' })}
										extra={
											<a
												onClick={() => {
													setField('dendkcb');
													setVisibleTimKiem(true);
												}}
											>
												{intl.formatMessage({ id: 'sachtailieu.anpham.timKiem' })}
											</a>
										}
									>
										<Input placeholder={intl.formatMessage({ id: 'sachtailieu.inmavach.nhapDangKyCaBiet' })} />
									</Form.Item>
								</Col>
							</Row>
						) : (
							<Form.Item
								name='madkcb'
								label={intl.formatMessage({ id: 'sachtailieu.inmavach.inTheoDangKyCaBiet' })}
								extra={intl.formatMessage({ id: 'sachtailieu.inmavach.luuY' })}
							>
								<Input.TextArea
									rows={3}
									placeholder={intl.formatMessage({ id: 'sachtailieu.inmavach.nhapThongTin' })}
								/>
							</Form.Item>
						)}
					</Col>
				</Row>

				<Space style={{ marginTop: 8 }}>
					<Button
						icon={<ReloadOutlined />}
						onClick={() => {
							resetFieldsForm(form, {
								kieuIn: kieuIn,
							});
						}}
					>
						{intl.formatMessage({ id: 'sachtailieu.button.lamMoi' })}
					</Button>

					<ButtonExtend type='primary' onClick={() => handlePrintBarcord()}>
						{intl.formatMessage({ id: 'sachtailieu.button.inBarcode' })}
					</ButtonExtend>

					<ButtonExtend type='primary' loading={loadingExport} onClick={handleExport}>
						{intl.formatMessage({ id: 'sachtailieu.button.inNhanGay' })}
					</ButtonExtend>
				</Space>
			</Form>

			<PrintBarcode ref={componentRef} listBarcodes={listBarcodes?.map((item) => item)} />

			<Modal
				title={`Thông tin ${kieuIn === 'maTaiLieu' ? intl.formatMessage({ id: 'sachtailieu.maTaiLieu' }) : intl.formatMessage({ id: 'sachtailieu.dkcb' })}`}
				open={visibleTimKiem}
				onCancel={() => setVisibleTimKiem(false)}
				width={1000}
				footer={
					<div className='form-footer'>
						<Button onClick={() => setVisibleTimKiem(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
					</div>
				}
				destroyOnClose
			>
				<TimKiemInMaVach field={field} form={form} setVisibleTimKiem={setVisibleTimKiem} />
			</Modal>
		</Card>
	);
};

export default InMaVachPage;
