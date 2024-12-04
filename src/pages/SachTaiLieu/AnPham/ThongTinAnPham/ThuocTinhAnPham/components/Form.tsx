import SelectTruongCon from '@/pages/DanhMuc/TruongBienMuc/TruongCon/components/Select';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormThuocTinhAnPham = (props: any) => {
	const { title, getData } = props;
	const [form] = Form.useForm();
	const intl = useIntl();
	const { record: recThongTinAnPham } = useModel('sachtailieu.anpham.thongtinanpham');
	const { edit, record, formSubmiting, visibleForm, setVisibleForm, putModel, postModel } = useModel(
		'sachtailieu.anpham.thuoctinhanpham',
	);

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: AnPham.IThongTinAnPham) => {
		if (edit) {
			putModel(record?._id ?? '', values, getData)
				.then()
				.catch((er) => console.log(er));
		} else
			postModel({ ...values, thongTinAnPhamId: recThongTinAnPham?._id }, getData)
				.then()
				.catch((er) => console.log(er));
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()}`}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col xs={24}>
						<Form.Item name='code' label='Trường con' rules={[...rules.required]}>
							<SelectTruongCon selectMa />
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item name='value' label='Value'>
							<Input placeholder='Nhập value' />
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
		</Card>
	);
};

export default FormThuocTinhAnPham;
