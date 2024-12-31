import MyDatePicker from '@/components/MyDatePicker';
import SelectKhoSach from '@/pages/DanhMuc/KhoSach/components/Select';
import SelectThuVien from '@/pages/DanhMuc/ThuVien/components/Select';
import rules from '@/utils/rules';
import { Button, Col, Descriptions, Divider, Form, Input, Modal, Row } from 'antd';
import { useIntl, useModel } from 'umi';

const ModalXepGia = (props: { visibleForm: boolean; setVisibleForm: (val: boolean) => void }) => {
	const intl = useIntl();
	const { visibleForm, setVisibleForm } = props;
	const [form] = Form.useForm();
	const { record, formSubmiting } = useModel('sachtailieu.anpham.anpham');

	const onFinish = async (values: BienMucSachTaiLieu.IRecord) => {
		// if (edit) {
		// 	putModel(record?._id ?? '', values, undefined, undefined, false)
		// 		.then((rec) => setVisibleForm(false))
		// 		.catch((er) => console.log(er));
		// } else
		// 	postBienMucModel(values)
		// 		.then((rec) => {
		// 			setRecord(rec);
		// 			setEdit(true);
		// 			if (afterAddNew) afterAddNew(rec);
		// 		})
		// 		.catch((er) => console.log(er));
	};

	return (
		<Modal title='Xếp giá' visible={visibleForm} onCancel={() => setVisibleForm(false)} footer={null} width={800}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col span={24}>
						<Descriptions column={1}>
							<Descriptions.Item label='Mã tài liệu'>{record?.ten ?? 'Không có thông tin'}</Descriptions.Item>
							<Descriptions.Item label='Nhan đề'>{record?.nhanDe ?? '--'}</Descriptions.Item>
							<Descriptions.Item label='Tác giả'>{record?.tacGia ?? '--'}</Descriptions.Item>
						</Descriptions>
					</Col>
					<Col span={24}>
						<Divider>Thông tin xếp giá bổ sung</Divider>
					</Col>

					<Col xs={24} md={12}>
						<Form.Item name='nguonBoSung' label='Nguồn bổ sung' rules={[...rules.required]}>
							<Input placeholder='Ngồn bổ sung' />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='kieuTuLieu' label='Kiểu tư liệu (lưu thông)' rules={[...rules.required]}>
							<Input placeholder='Kiểu tư liệu ' />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='ngayBoSung' label='Ngày bổ sung' rules={[...rules.required]}>
							<MyDatePicker />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='donGia' label='Đơn giá (đ/bản)' rules={[...rules.required]}>
							<Input placeholder='Đơn giá' />
						</Form.Item>
					</Col>

					<Col span={24}>
						<Divider>Thông tin vị trí xếp giá</Divider>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='thuvien' label='Thư viện' rules={[...rules.required]}>
							<SelectThuVien />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='kho' label='Kho' rules={[...rules.required]}>
							<SelectKhoSach />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='giaSach' label='Giá sách' rules={[...rules.required]}>
							<Input placeholder='Giá sách' />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='dkcb' label='Đăng ký cá biệt' rules={[...rules.required]}>
							<Input placeholder='Đăng ký cá biệt' />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='soLuong' label='Số lượng' rules={[...rules.required]}>
							<Input placeholder='Số lượng' />
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						Xếp giá
					</Button>
					<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default ModalXepGia;
