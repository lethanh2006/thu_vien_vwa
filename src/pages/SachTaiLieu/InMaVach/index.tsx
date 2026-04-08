import PrintBarcode from '@/components/PrintTemplate/Barcode';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { exportNhanMaGay } from '@/services/SachTaiLieu/AnPham';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { ReloadOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, Modal, Radio, Row, Space } from 'antd';
import fileDownload from 'js-file-download';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import TimKiemInMaVach from './components/TimKiem';

const InMaVachPage = () => {
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

		if (endNum < startNum) return [];

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

	const handlePrint = async () => {
		try {
			await form.validateFields();

			if (listBarcodes.length === 0) {
				throw new Error('Không có mã vạch để in');
			}

			handlePrintBarcord?.();
		} catch (error) {
			console.log(error);
		}
	};

	const handleExport = async () => {
		try {
			await form.validateFields();

			if (listBarcodes.length === 0) {
				throw new Error('Không có mã vạch để in');
			}

			setLoadingExport(true);

			const res = await exportNhanMaGay(
				kieuIn === 'maTaiLieu'
					? { danhSachMaTaiLieu: listBarcodes, danhSachSoDangKyCaBiet: [] }
					: { danhSachSoDangKyCaBiet: listBarcodes, danhSachMaTaiLieu: [] },
			);

			fileDownload(res.data, 'Danh sách nhãn mã gáy.docx');
		} catch (error) {
			console.error('Export failed:', error);
		} finally {
			setLoadingExport(false);
		}
	};

	return (
		<Card title='In mã vạch cho tài liệu'>
			<Form form={form} layout='vertical'>
				<Row gutter={[12, 12]}>
					<Col span={24}>
						<Form.Item name='kieuIn'>
							<Radio.Group
								options={[
									{ value: 'maTaiLieu', label: 'Mã tài liệu' },
									{ value: 'dkcb', label: 'Đăng ký cá biệt' },
									{ value: 'cuThe', label: 'Cụ thể' },
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
										label='Từ mã tài liệu'
										rules={[...rules.required]}
										extra={
											<a
												onClick={() => {
													setField('tuMaTaiLieu');
													setVisibleTimKiem(true);
												}}
											>
												Tìm kiếm
											</a>
										}
									>
										<Input placeholder='Nhập mã tài liệu' />
									</Form.Item>
								</Col>
								<Col span={12}>
									<Form.Item
										name='denMaTaiLieu'
										label='Đến mã tài liệu'
										rules={[...rules.required]}
										extra={
											<a
												onClick={() => {
													setField('denMaTaiLieu');
													setVisibleTimKiem(true);
												}}
											>
												Tìm kiếm
											</a>
										}
									>
										<Input placeholder='Nhập mã tài liệu' />
									</Form.Item>
								</Col>
							</Row>
						) : kieuIn === 'dkcb' ? (
							<Row gutter={[12, 0]}>
								<Col span={12}>
									<Form.Item
										name='tudkcb'
										label='Từ ĐKCB'
										extra={
											<a
												onClick={() => {
													setField('tudkcb');
													setVisibleTimKiem(true);
												}}
											>
												Tìm kiếm
											</a>
										}
										rules={[...rules.required]}
									>
										<Input placeholder='Nhập đăng ký cá biệt' />
									</Form.Item>
								</Col>
								<Col span={12}>
									<Form.Item
										name='dendkcb'
										label='Đến ĐKCB'
										extra={
											<a
												onClick={() => {
													setField('dendkcb');
													setVisibleTimKiem(true);
												}}
											>
												Tìm kiếm
											</a>
										}
										rules={[...rules.required]}
									>
										<Input placeholder='Nhập đăng ký cá biệt' />
									</Form.Item>
								</Col>
							</Row>
						) : (
							<Form.Item
								name='madkcb'
								label='In theo các đăng ký cá biệt nhập dưới đây'
								rules={[...rules.required]}
								extra='Lưu ý các phần tử cách nhau bằng dấu phẩy (,)'
							>
								<Input.TextArea rows={3} placeholder='VD: DK001, DK002' />
							</Form.Item>
						)}
					</Col>
				</Row>

				<Space style={{ marginTop: 8 }}>
					<Button
						icon={<ReloadOutlined />}
						onClick={() =>
							resetFieldsForm(form, {
								kieuIn,
							})
						}
					>
						Làm mới
					</Button>

					<ButtonExtend type='primary' onClick={handlePrint}>
						In Barcode
					</ButtonExtend>

					<ButtonExtend type='primary' loading={loadingExport} onClick={handleExport}>
						In nhãn gáy
					</ButtonExtend>
				</Space>
			</Form>

			<PrintBarcode ref={componentRef} listBarcodes={listBarcodes} />

			<Modal
				title={`Thông tin ${kieuIn === 'maTaiLieu' ? 'mã tài liệu' : 'đăng ký cá biệt'}`}
				open={visibleTimKiem}
				onCancel={() => setVisibleTimKiem(false)}
				width={1000}
				footer={<Button onClick={() => setVisibleTimKiem(false)}>Đóng</Button>}
				destroyOnClose
			>
				<TimKiemInMaVach field={field} form={form} setVisibleTimKiem={setVisibleTimKiem} />
			</Modal>
		</Card>
	);
};

export default InMaVachPage;
