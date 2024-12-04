import SelectTruongBienMuc from '@/pages/DanhMuc/TruongBienMuc/components/Select';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormThongTinAnPham = (props: { afterAddNew?: (rec: AnPham.IThongTinAnPham) => void; getData: () => void }) => {
	const { afterAddNew, getData } = props;
	const [form] = Form.useForm();
	const intl = useIntl();
	const { edit, record, formSubmiting, visibleForm, setVisibleForm, putModel, postModel, setRecord, setEdit } =
		useModel('sachtailieu.anpham.thongtinanpham');

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
			postModel(values, getData, false)
				.then((rec) => {
					setRecord(rec);
					setEdit(true);
					if (afterAddNew) afterAddNew(rec);
				})
				.catch((er) => console.log(er));
	};

	return (
		<Form onFinish={onFinish} form={form} layout='vertical'>
			<Row gutter={[12, 0]}>
				<Col xs={24}>
					<Form.Item name='ind1' label='Chỉ thị 1' rules={[...rules.required]}>
						<Input placeholder='Nhập chỉ thị 1' />
					</Form.Item>
				</Col>
				<Col xs={24}>
					<Form.Item name='ind2' label='Chỉ thị 2' rules={[...rules.required]}>
						<Input placeholder='Nhập chỉ thị 2' />
					</Form.Item>
				</Col>
				<Col xs={24}>
					<Form.Item name='tagCode' label='Biêm mục' rules={[...rules.required]}>
						<SelectTruongBienMuc selectMa />
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
	);
};

export default FormThongTinAnPham;
