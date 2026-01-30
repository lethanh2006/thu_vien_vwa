import MyDatePicker from '@/components/MyDatePicker';
import ButtonExtend from '@/components/Table/ButtonExtend';
import SelectGiaSach from '@/pages/DanhMuc/GiaSach/components/Select';
import SelectKhoSach from '@/pages/DanhMuc/KhoSach/components/Select';
import SelectKieuTuLieu from '@/pages/DanhMuc/KieuTuLieu/components/Select';
import SelectNguonBoSung from '@/pages/DanhMuc/NguonBoSung/components/Select';
import SelectThuVien from '@/pages/DanhMuc/ThuVien/components/Select';
import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import {
	Button,
	Card,
	Col,
	Descriptions,
	Divider,
	Form,
	Input,
	InputNumber,
	Modal,
	Popconfirm,
	Row,
	Spin,
	Tabs,
} from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import SelectDotNhapSach from '../../DotNhapSach/components/Select';
import LichSuXepGia from '../LichSuXepGia';

const ModalXepGia = () => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record } = useModel('sachtailieu.anpham.anpham');
	const {
		formSubmiting,
		postModel,
		record: recXepGia,
		visibleForm,
		setVisibleForm,
		thongKeXepGiaModel,
		loadingThongKe,
		datathongKeXepGia,
	} = useModel('sachtailieu.anpham.xepgia');
	const { danhSach: danhSachKhoSach } = useModel('danhmuc.khosach');
	const maKhoSach: string = Form.useWatch('maKhoSach', form);
	const [actionType, setActionType] = useState<string>();
	const [tabActive, setTabActive] = useState<string>('1');

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
		} else if (record?._id) {
			thongKeXepGiaModel({ anPhamId: record?._id });
			form.setFieldsValue({
				dotNhapSachId: record?.dotNhapSachId,
			});
		}
	}, [visibleForm, record?._id]);

	const onFinish = async (values: AnPham.IXepGia) => {
		postModel(
			{
				...values,
				daXepGia: actionType === 'luu_lai' ? false : true,
				anPhamId: record?._id,
				dotNhapSachId: record?.dotNhapSachId,
			},
			() => {
				thongKeXepGiaModel({ anPhamId: record?._id });
				resetFieldsForm(form);
				setTabActive('2');
			},
			false,
			'Lưu thành công',
		)
			.then()
			.catch((er) => console.log(er));
	};

	return (
		<Modal
			title={intl.formatMessage({ id: 'sachtailieu.xepGia.title' })}
			open={visibleForm}
			onCancel={() => setVisibleForm(false)}
			footer={null}
			width={1000}
			destroyOnClose
		>
			<Spin spinning={loadingThongKe}>
				<Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
					<Col span={12} md={12}>
						<Card className='card-stat-small'>
							<span className='num' style={{ color: 'blue' }}>
								{datathongKeXepGia?.chuaXepGia ?? '--'}
							</span>
							<span>{intl.formatMessage({ id: 'sachtailieu.anpham.dangXepGia' })}</span>
						</Card>
					</Col>
					<Col span={12} md={12}>
						<Card className='card-stat-small'>
							<span className='num' style={{ color: 'green' }}>
								{datathongKeXepGia?.daXepGia ?? '--'}
							</span>
							<span>{intl.formatMessage({ id: 'sachtailieu.anpham.daXepGia' })}</span>
						</Card>
					</Col>
				</Row>
			</Spin>

			<Tabs onChange={(tab) => setTabActive(tab)} activeKey={tabActive}>
				<Tabs.TabPane tab={intl.formatMessage({ id: 'sachtailieu.xepGia.title' })} key='1' />
				<Tabs.TabPane tab={intl.formatMessage({ id: 'sachtailieu.anpham.lichSuXepGia' })} key='2' />
			</Tabs>

			{tabActive === '1' ? (
				<Form onFinish={onFinish} form={form} layout='vertical'>
					<Row gutter={[12, 0]}>
						<Col span={24}>
							<Descriptions column={1}>
								<Descriptions.Item label={intl.formatMessage({ id: 'sachtailieu.anpham.nhanDe' })}>
									{record?.nhanDe ?? recXepGia?.anPham?.nhanDe}
								</Descriptions.Item>
								<Descriptions.Item label={intl.formatMessage({ id: 'sachtailieu.anpham.tacGia' })}>
									{record?.tacGia ?? recXepGia?.anPham?.tacGia}
								</Descriptions.Item>
							</Descriptions>
						</Col>
						<Col span={24}>
							<Divider>{intl.formatMessage({ id: 'sachtailieu.anpham.thongTinXepGiaBoSung' })}</Divider>
						</Col>
						<Col xs={24}>
							<Form.Item
								name='dotNhapSachId'
								label={intl.formatMessage({ id: 'sachtailieu.anpham.soDangKyTongQuat' })}
								// rules={[...rules.required]}
							>
								<SelectDotNhapSach allowClear />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item
								name='maNguonBoSung'
								label={intl.formatMessage({ id: 'sachtailieu.anpham.nguonBoSung' })}
								rules={[...rules.required]}
							>
								<SelectNguonBoSung selectMa />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item
								name='maKieuTuLieu'
								label={intl.formatMessage({ id: 'sachtailieu.anpham.kieuTuLieu' })}
								rules={[...rules.required]}
							>
								<SelectKieuTuLieu selectMa />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item
								name='ngayBoSung'
								label={intl.formatMessage({ id: 'sachtailieu.anpham.ngayBoSung' })}
								rules={[...rules.required]}
							>
								<MyDatePicker />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item name='donGia' label={intl.formatMessage({ id: 'sachtailieu.anpham.donGia' })}>
								<InputNumber
									formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
									style={{ width: '100%' }}
									placeholder={intl.formatMessage({ id: 'sachtailieu.anpham.nhapDonGia' })}
									min={0}
									addonAfter='VNĐ'
								/>
							</Form.Item>
						</Col>
						<Col span={24}>
							<Divider>{intl.formatMessage({ id: 'sachtailieu.anpham.thongTinViTriXepGia' })}</Divider>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item
								name='thuVienId'
								label={intl.formatMessage({ id: 'sachtailieu.anpham.thuVien' })}
								rules={[...rules.required]}
							>
								<SelectThuVien />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item
								name='maKhoSach'
								label={intl.formatMessage({ id: 'sachtailieu.anpham.kho' })}
								rules={[...rules.required]}
							>
								<SelectKhoSach
									selectMa
									onChange={(val) => {
										form.resetFields(['giaSachId']);

										const index = danhSachKhoSach?.find((item) => item?.ma === val);
										form.setFieldsValue({
											soDangKyCaBiet: `${index?.ma}/${String((index?.soLuongAnPhamDaXepGia ?? 0) + 1).padStart(
												5,
												'0',
											)}`,
										});
									}}
								/>
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item name='giaSachId' label={intl.formatMessage({ id: 'sachtailieu.anpham.giaSach' })}>
								<SelectGiaSach condition={{ maKhoSach: maKhoSach }} />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item
								name='soDangKyCaBiet'
								label={intl.formatMessage({ id: 'sachtailieu.anpham.dangKyCaBiet' })}
								rules={[...rules.required]}
							>
								<Input placeholder={intl.formatMessage({ id: 'sachtailieu.anpham.dangKyCaBiet' })} disabled />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item
								name='soLuong'
								label={intl.formatMessage({ id: 'sachtailieu.anpham.soLuong' })}
								rules={[...rules.required]}
							>
								<InputNumber
									style={{ width: '100%' }}
									placeholder={intl.formatMessage({ id: 'sachtailieu.anpham.nhapSoLuong' })}
								/>
							</Form.Item>
						</Col>

						<Col xs={24}>
							<Form.Item name='ghiChu' label={intl.formatMessage({ id: 'sachtailieu.anpham.ghiChu' })}>
								<Input placeholder={intl.formatMessage({ id: 'sachtailieu.anpham.nhapGhiChu' })} />
							</Form.Item>
						</Col>
					</Row>

					<div className='form-footer'>
						<ButtonExtend
							loading={formSubmiting}
							type='primary'
							onClick={() => {
								setActionType('luu_lai');
								form.submit();
							}}
						>
							{intl.formatMessage({ id: 'global.button.luulai' })}
						</ButtonExtend>
						<Popconfirm
							onConfirm={() => {
								setActionType('xep_gia');
								form.submit();
							}}
							title={intl.formatMessage({ id: 'sachtailieu.confirm.xepGia' })}
							placement='topRight'
						>
							<ButtonExtend loading={formSubmiting} type='primary'>
								{intl.formatMessage({ id: 'sachtailieu.button.xepGia' })}
							</ButtonExtend>
						</Popconfirm>
						<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
					</div>
				</Form>
			) : (
				<LichSuXepGia />
			)}
		</Modal>
	);
};

export default ModalXepGia;
