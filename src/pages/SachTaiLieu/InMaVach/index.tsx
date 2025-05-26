import PrintTemplate from '@/components/PrintTemplate';
import PrintBarcode from '@/components/PrintTemplate/Barcode';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { ETrangThaiBienMuc } from '@/services/SachTaiLieu/constant';
import { resetFieldsForm } from '@/utils/utils';
import { ReloadOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, Modal, Radio, Row, Space, Spin } from 'antd';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactToPrint from 'react-to-print';
import { useModel } from 'umi';
import TimKiemInMaVach from './components/TimKiem';
import './style.less';

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
	const { timKiemAnPhamTuDenModel, danhSach, loading } = useModel('sachtailieu.anpham.anpham');

	const componentRef = useRef(null);
	const componentRefMaGay = useRef(null);

	const reactToPrintContent = useCallback(() => componentRef.current, [componentRef.current]);

	const reactToPrintTrigger = useCallback(() => <ButtonExtend type='primary'>In Barcode</ButtonExtend>, []);

	const reactToPrintContentMaGay = useCallback(() => componentRefMaGay.current, [componentRefMaGay.current]);

	const reactToPrintTriggerMaGay = useCallback(() => <ButtonExtend type='primary'>In nhãn gáy</ButtonExtend>, []);

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
										extra={
											<a
												onClick={() => {
													setField(denMaTaiLieu);
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
									>
										<Input placeholder='Nhập đăng ký cá biệt' />
									</Form.Item>
								</Col>
							</Row>
						) : (
							<Form.Item
								name='madkcb'
								label='In theo các đăng ký cá biệt nhập dưới đây'
								extra='Lưu ý các phần tử cách nhau bằng dấu phẩy (,)'
							>
								<Input.TextArea rows={3} placeholder='Nhập thông tin' />
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
						Làm mới
					</Button>

					<ReactToPrint content={reactToPrintContent} trigger={reactToPrintTrigger} removeAfterPrint />

					<Spin spinning={loading}>
						<ReactToPrint
							content={reactToPrintContentMaGay}
							trigger={reactToPrintTriggerMaGay}
							removeAfterPrint
							onBeforeGetContent={async () => {
								if (listBarcodes.length === 0) {
									return Promise.reject('Không có mã vạch để in');
								}
								{
									await timKiemAnPhamTuDenModel(
										kieuIn === 'maTaiLieu'
											? { danhSachMaTaiLieu: listBarcodes, danhSachSoDangKyCaBiet: [] }
											: { danhSachSoDangKyCaBiet: listBarcodes, danhSachMaTaiLieu: [] },
									);
								}
							}}
						/>
					</Spin>
				</Space>
			</Form>

			<PrintBarcode ref={componentRef} listBarcodes={listBarcodes?.map((item) => item)} />

			<PrintTemplate ref={componentRefMaGay} hideTieuNgu footer={<></>}>
				<div className='to-print'>
					<div className='label-grid'>
						{danhSach
							?.filter((item) => item?.trangThai === ETrangThaiBienMuc.DA_BIEN_MUC)
							?.map((item, index) =>
								item?.danhSachAnPhamVatLy?.map((anPham, subIndex) => (
									// eslint-disable-next-line react/no-array-index-key
									<div className='label-box' key={`${index}-${subIndex}`}>
										<div style={{ position: 'absolute', top: 0, left: 1 }}>
											<img src={`${APP_CONFIG_URL_THU_VIEN}logo.png`} width={15} height={18} />
										</div>

										<div className='label-section top'>
											<div style={{ paddingLeft: 3 }}>HỌC VIỆN CNBCVT</div>
											<div style={{ fontWeight: 'bold' }}>TRUNG TÂM TT-TV</div>
										</div>

										<div className='label-section middle'>
											<div>
												{item?.danhSachThongTin
													?.find((item1) => item1.tagCode === '090')
													?.thuocTinhAnPham?.find((item2) => item2?.code === '$a')?.value || '621.382'}
											</div>
											<div>
												{item?.danhSachThongTin
													?.find((item1) => item1.tagCode === '090')
													?.thuocTinhAnPham?.find((item2) => item2?.code === '$b')?.value || 'HO-M'}
											</div>
											<div>
												{item?.danhSachThongTin
													?.find((item1) => item1.tagCode === '260')
													?.thuocTinhAnPham?.find((item2) => item2?.code === '$c')?.value || '2009'}
											</div>
										</div>

										<div className='label-section bottom' style={{ whiteSpace: 'pre-line' }}>
											{anPham.soDangKyCaBiet?.replace('/', '/\n')}
										</div>
									</div>
								)),
							)}
					</div>
				</div>
			</PrintTemplate>

			<Modal
				title={`Thông tin ${kieuIn === 'maTaiLieu' ? 'mã tài liệu' : 'đăng ký cá biệt'}`}
				visible={visibleTimKiem}
				onCancel={() => setVisibleTimKiem(false)}
				width={1000}
				footer={
					<div className='form-footer'>
						<Button onClick={() => setVisibleTimKiem(false)}>Đóng</Button>
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
