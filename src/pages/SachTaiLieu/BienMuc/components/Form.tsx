import SelectCapThuMuc from '@/pages/DanhMuc/CapThuMuc/components/Select';
import SelectDangTaiLieu from '@/pages/DanhMuc/DangTaiLieu/components/Select';
import SelectKieuBanGhi from '@/pages/DanhMuc/KieuBanGhi/components/Select';
import SelectMauBienMuc from '@/pages/DanhMuc/MauBienMuc/components/Select';
import SelectVatMangTin from '@/pages/DanhMuc/VatMangTin/components/Select';
import type { BienMucSachTaiLieu } from '@/services/SachTaiLieu/BienMuc/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Form, Input, InputNumber, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormBienMucSachTaiLieu = (props: { afterAddNew: (rec: BienMucSachTaiLieu.IRecord) => void }) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postBienMucModel, putModel, formSubmiting, setRecord, setEdit, visibleForm } =
		useModel('sachtailieu.bienmuc');
	const { afterAddNew } = props;

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: BienMucSachTaiLieu.IRecord) => {
		if (edit) {
			putModel(record?._id ?? '', values, undefined, undefined, false)
				.then((rec) => setVisibleForm(false))
				.catch((er) => console.log(er));
		} else
			postBienMucModel(values)
				.then((rec) => {
					setRecord(rec);
					setEdit(true);
					if (afterAddNew) afterAddNew(rec);
				})
				.catch((er) => console.log(er));
	};

	return (
		<Form onFinish={onFinish} form={form} layout='vertical'>
			<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
				<Col xs={24} md={12}>
					<Form.Item name='kieuBanGhiId' label='Kiểu bản ghi' rules={[...rules.required]}>
						<SelectKieuBanGhi />
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item name='capThuMucId' label='Cấp thư mục' rules={[...rules.required]}>
						<SelectCapThuMuc />
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item name='dangTaiLieuId' label='Dạng tài liệu' rules={[...rules.required]}>
						<SelectDangTaiLieu />
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item name='vatMangTinId' label='Vật mang tin' rules={[...rules.required]}>
						<SelectVatMangTin />
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item name='mauBienMucId' label='Mẫu biên mục' rules={[...rules.required]}>
						<SelectMauBienMuc />
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item name='doMat' label='Độ mật' rules={[...rules.required, ...rules.number(10, 0)]}>
						<InputNumber style={{ width: '100%' }} placeholder='Nhập độ mật' />
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item name='ISBN' label='ISBN'>
						<Input placeholder='Nhập ISBN' />
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item name='ISSN' label='ISSN'>
						<Input placeholder='Nhập ISSN' />
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item name='tacGia' label='Tác giả'>
						<Input placeholder='Nhập tác giả' />
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item name='nhanDeChinh' label='Nhan đề chính'>
						<Input placeholder='Nhập nhan đề chính' />
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item name='soThuTuCuaTap' label='Số thứ tự của tập'>
						<Input placeholder='Nhập số thứ tự của tập' />
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item name='tenTap' label='Tên tập'>
						<Input placeholder='Nhập tên tập' />
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item name='nhanDeSongSong' label='Nhan đề song song'>
						<Input placeholder='Nhập nhan đề song song' />
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item name='phuDe' label='Phụ đề'>
						<Input placeholder='Nhập phụ đề' />
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item name='thongTinTrachNhiem' label='Thông tin trách nhiệm'>
						<Input placeholder='Nhập thông tin trách nhiệm' />
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item name='lanXuatBan' label='Lần xuất bản'>
						<Input placeholder='Nhập lần xuất bản' />
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item name='noiXuatBan' label='Nơi xuất bản'>
						<Input placeholder='Nhập nơi xuất bản' />
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item name='namXuatBan' label='Năm xuất bản'>
						<InputNumber style={{ width: '100%' }} placeholder='Nhập năm xuất bản' />
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item name='nhaXuatBan' label='Nhà xuất bản'>
						<Input placeholder='Nhập nhà xuất bản' />
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item name='soTrang' label='Số trang'>
						<InputNumber style={{ width: '100%' }} placeholder='Nhập số trang' />
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item name='dacDiemVatLy' label='Đặc điểm vật lý'>
						<Input placeholder='Nhập đặc điểm vật lý' />
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item name='khuonKho' label='Khuôn khổ'>
						<Input placeholder='Nhập khuôn khổ' />
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item name='tuLieuDiKiem' label='Tư liệu đi kèm'>
						<Input placeholder='Nhập tư liệu đi kèm' />
					</Form.Item>
				</Col>
			</Row>

			<div className='form-footer'>
				<Button loading={formSubmiting} htmlType='submit' type='primary'>
					{!edit
						? `${intl.formatMessage({ id: 'global.button.themmoi' })}`
						: `${intl.formatMessage({ id: 'global.button.luulai' })}`}
				</Button>
				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
			</div>
		</Form>
	);
};

export default FormBienMucSachTaiLieu;
