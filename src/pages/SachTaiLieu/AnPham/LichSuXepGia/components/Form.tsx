import MyDatePicker from '@/components/MyDatePicker';
import ButtonExtend from '@/components/Table/ButtonExtend';
import SelectGiaSach from '@/pages/DanhMuc/GiaSach/components/Select';
import SelectKhoSach from '@/pages/DanhMuc/KhoSach/components/Select';
import SelectKieuTuLieu from '@/pages/DanhMuc/KieuTuLieu/components/Select';
import SelectNguonBoSung from '@/pages/DanhMuc/NguonBoSung/components/Select';
import SelectThuVien from '@/pages/DanhMuc/ThuVien/components/Select';
import SelectDotNhapSach from '@/pages/SachTaiLieu/DotNhapSach/components/Select';
import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import { SO_LUONG_XEP_GIA_TOI_DA } from '@/services/SachTaiLieu/constant';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Alert, Button, Col, Divider, Form, Input, InputNumber, Popconfirm, Row } from 'antd';
import { useEffect, useState } from 'react';
import { history, useIntl, useModel } from 'umi';
import FormItemDKCBTiepTheo from '../../components/FormItemDKCBTiepTheo';

/** `visible`: trạng thái modal chứa form, mặc định theo `visibleForm` của model */
const FormLichSuXepGia = (props: { onCancel: () => void; onOk: () => void; visible?: boolean }) => {
	const { onCancel, onOk } = props;
	const intl = useIntl();
	const [form] = Form.useForm();
	const { formSubmiting, putModel, record, visibleForm } = useModel('sachtailieu.anpham.xepgia');
	const maKhoSach: string = Form.useWatch('maKhoSach', form);
	const [xacNhanXepGia, setXacNhanXepGia] = useState<boolean>(false);
	const visible = props.visible ?? visibleForm;

	useEffect(() => {
		if (!visible) {
			resetFieldsForm(form);
		} else if (record?._id) {
			form.setFieldsValue(record);
		}
	}, [visible, record?._id]);

	const onFinish = async (values: AnPham.IXepGia) => {
		if (record?._id) {
			putModel(
				record?._id,
				// Dòng đã xếp giá thì giữ trạng thái đã xếp giá
				{ ...values, daXepGia: record.daXepGia || xacNhanXepGia },
				onOk,
				undefined,
				false,
				intl.formatMessage({ id: 'sachtailieu.anpham.xepgia.capNhatThanhCong' }),
			)
				.then()
				.catch((er) => console.log(er));
		}
	};

	return (
		<>
			<Alert
				style={{ marginBottom: 12 }}
				type={record?.daXepGia ? 'success' : 'info'}
				showIcon
				message={
					record?.daXepGia ? (
						<>
							{intl.formatMessage({ id: 'sachtailieu.anpham.xepgia.daXepGia' })},{' '}
							<a
								onClick={() => {
									history.push('/bien-muc/an-pham');
									onCancel();
								}}
							>
								{intl.formatMessage({ id: 'sachtailieu.anpham.xepgia.xepGiaTiep' })}
							</a>
						</>
					) : (
						intl.formatMessage({ id: 'sachtailieu.anpham.xepgia.dangXepGia' })
					)
				}
				description={
					record?.daXepGia ? intl.formatMessage({ id: 'sachtailieu.anpham.xepgia.moTaDaXepGia' }) : undefined
				}
			/>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col span={24}>
						<Divider>{intl.formatMessage({ id: 'sachtailieu.anpham.thongTinXepGiaBoSung' })}</Divider>
					</Col>
					<Col xs={24}>
						<Form.Item
							name='dotNhapSachId'
							label={intl.formatMessage({ id: 'sachtailieu.anpham.soDangKyTongQuat' })}
							//  rules={[...rules.required]}
						>
							<SelectDotNhapSach />
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
							<SelectKhoSach selectMa disabled={record?.daXepGia} onChange={() => form.resetFields(['giaSachId'])} />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='giaSachId' label={intl.formatMessage({ id: 'sachtailieu.anpham.giaSach' })}>
							<SelectGiaSach condition={{ maKhoSach: maKhoSach }} />
						</Form.Item>
					</Col>
					{!record?.daXepGia && (
						<Col xs={24} md={12}>
							<FormItemDKCBTiepTheo maKhoSach={maKhoSach} />
						</Col>
					)}
					<Col xs={24} md={12}>
						<Form.Item
							name='soLuong'
							label={intl.formatMessage({ id: 'sachtailieu.anpham.soLuong' })}
							rules={record?.daXepGia ? [] : [...rules.required, ...rules.number(SO_LUONG_XEP_GIA_TOI_DA, 1, false)]}
						>
							<InputNumber
								disabled={record?.daXepGia}
								style={{ width: '100%' }}
								placeholder={intl.formatMessage({ id: 'sachtailieu.anpham.nhapSoLuong' })}
							/>
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
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
							setXacNhanXepGia(false);
							form.submit();
						}}
					>
						{intl.formatMessage({ id: 'global.button.luulai' })}
					</ButtonExtend>
					<Popconfirm
						onConfirm={() => {
							setXacNhanXepGia(true);
							form.submit();
						}}
						title={intl.formatMessage({ id: 'sachtailieu.confirm.xepGia' })}
						placement='topRight'
					>
						<ButtonExtend disabled={record?.daXepGia} loading={formSubmiting} type='primary'>
							{intl.formatMessage({ id: 'sachtailieu.button.xepGia' })}
						</ButtonExtend>
					</Popconfirm>
					<Button onClick={() => onCancel()}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
		</>
	);
};

export default FormLichSuXepGia;
