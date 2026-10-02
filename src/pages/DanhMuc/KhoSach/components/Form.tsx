import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, InputNumber, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import SelectPhongDoc from '../../PhongDoc/components/Select';

const FormKhoSach = (props: any) => {
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } = useModel('danhmuc.khosach');
	const intl = useIntl();
	const [form] = Form.useForm();
	const { title } = props;

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (edit && record?._id) form.setFieldsValue(record);
		else resetFieldsForm(form, { soLuongAnPhamDaXepGia: 0 });
	}, [edit, record?._id, visibleForm]);

	const onFinish = async (values: KhoSach.IRecord) => {
		if (edit) {
			putModel(record?._id ?? '', { ma: values.ma, ten: values.ten, maPhongDoc: values.maPhongDoc })
				.then()
				.catch((er) => console.log(er));
		} else {
			postModel(values)
				.then()
				.catch((er) => console.log(er));
		}
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()}`}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col span={24}>
						<Form.Item label='Mã kho' name='ma' rules={[...rules.required, ...rules.text, ...rules.length(20)]}>
							<Input placeholder='Nhập mã kho' disabled={edit} />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item label='Tên kho' name='ten' rules={[...rules.required, ...rules.text, ...rules.length(250)]}>
							<Input placeholder='Nhập tên kho' />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item label='Phòng đọc' name='maPhongDoc' rules={[...rules.required]}>
							<SelectPhongDoc selectMa />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item
							label={edit ? 'Số bản đã xếp giá' : 'Số thứ tự ĐKCB đã sử dụng'}
							name='soLuongAnPhamDaXepGia'
							initialValue={0}
							rules={
								edit
									? []
									: [...rules.required, { type: 'integer', min: 0, message: 'Số thứ tự phải là số nguyên không âm' }]
							}
							extra={
								edit
									? 'Số liệu do hệ thống cập nhật khi thêm hoặc xóa bản ĐKCB.'
									: 'Nhập 0 để bắt đầu từ 00001. Ví dụ đã dùng đến số 500 thì nhập 500, hệ thống sẽ cấp tiếp từ 00501.'
							}
						>
							<InputNumber disabled={edit} min={0} step={1} style={{ width: '100%' }} placeholder='Nhập số thứ tự' />
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer' style={{ marginTop: 24 }}>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{!edit
							? `${intl.formatMessage({ id: 'global.button.themmoi' })}`
							: `${intl.formatMessage({ id: 'global.button.luulai' })}`}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormKhoSach;
