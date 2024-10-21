import type { MauBienMuc } from '@/services/DanhMuc/MauBienMuc/typing';
import { defaultElementBieuMau } from '@/services/DanhMuc/constant';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import _ from 'lodash';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import ElementBieuMauFormItem from './Element';

const FormNguoiKyVanBang = (props: { title?: string; [key: string]: any }) => {
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } =
		useModel('danhmuc.maubienmuc');
	const intl = useIntl();
	const [form] = Form.useForm();
	const { title } = props;

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: MauBienMuc.IRecord) => {
		const elementNames = values.thongTinKhaiBao?.map((item) => item?.ten);
		const uniqElements = _.uniq(elementNames);
		const duplicateDefault = defaultElementBieuMau.find((item) => uniqElements.includes(item.ten));
		if (uniqElements.length !== elementNames.length || duplicateDefault) {
			form.setFields([{ name: 'thongTinKhaiBao', errors: ['Các phần tử không được trùng nhau'] }]);
			return;
		} else form.setFields([{ name: 'thongTinKhaiBao', errors: undefined }]);

		if (edit) {
			putModel(record?._id ?? '', values)
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
					<Col span={24} md={8}>
						<Form.Item
							label='Mã mẫu biên mục'
							name='ma'
							rules={[...rules.required, ...rules.text, ...rules.length(20)]}
						>
							<Input placeholder='Nhập mã mẫu biên mục' disabled={edit} />
						</Form.Item>
					</Col>
					<Col span={24} md={16}>
						<Form.Item
							label='Tên mẫu biên mục'
							name='ten'
							rules={[...rules.required, ...rules.text, ...rules.length(250)]}
						>
							<Input placeholder='Nhập tên mẫu biên mục' />
						</Form.Item>
					</Col>

					<Col span={24}>
						<Form.Item label='Cấu hình mẫu biên mục' name='thongTinKhaiBao'>
							<ElementBieuMauFormItem />
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

export default FormNguoiKyVanBang;
