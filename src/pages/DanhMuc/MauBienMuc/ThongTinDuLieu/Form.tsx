import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import SelectTruongBienMuc from '../../TruongBienMuc/components/Select';

const FormMauBienMuc = (props: any) => {
	const { getData, title } = props;
	const { record: recMauBienMuc } = useModel('danhmuc.maubienmuc');
	const { record, setVisibleForm, edit, postModel, formSubmiting, visibleForm } = useModel('danhmuc.thongtindulieu');
	const { danhSach: danhSachTag } = useModel('danhmuc.truongbienmuc');
	const intl = useIntl();
	const [form] = Form.useForm();

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: MauBienMuc.IThongTinKhaiBao) => {
		const thongTinTag = danhSachTag.find((item) => item.ma === values.tag);
		values.ten = thongTinTag?.noiDung ?? '';

		postModel({ ...values, mauBienMucId: recMauBienMuc?._id }, getData)
			.then()
			.catch((er) => console.log(er));
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()}`}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col span={24}>
						<Form.Item label='Trường biên mục' name='tag' rules={[...rules.required]}>
							<SelectTruongBienMuc selectMa />
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

export default FormMauBienMuc;
