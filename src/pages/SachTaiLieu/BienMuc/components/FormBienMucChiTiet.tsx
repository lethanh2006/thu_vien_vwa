import MyDatePicker from '@/components/MyDatePicker';
import { ELoaiDuLieuBieuMau } from '@/services/DanhMuc/constant';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Form, Input, InputNumber, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormBienMucChiTiet = () => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, setVisibleForm, putBienMucChiTietModel, formSubmiting, visibleForm } =
		useModel('sachtailieu.bienmuc');

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		const thongTinTaiLieu = record?.thongTinTaiLieu?.map((item, index) => ({
			...item,
			value: values?.thongTinTaiLieu?.[index]?.value || null,
		}));

		putBienMucChiTietModel(record?._id ?? '', {
			thongTinTaiLieu: thongTinTaiLieu,
		})
			.then(() => setVisibleForm(false))
			.catch((er) => console.log(er));
	};

	return (
		<Form onFinish={onFinish} form={form} layout='vertical'>
			<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
				{record?.thongTinTaiLieu?.map((element, index) => (
					<Col span={24} md={12} key={element.ten}>
						<Form.Item
							label={element.ten}
							name={['thongTinTaiLieu', index, 'value']}
							rules={element.type === ELoaiDuLieuBieuMau.Text ? [...rules.text, ...rules.length(300)] : []}
						>
							{element.type === ELoaiDuLieuBieuMau.Number ? (
								<InputNumber style={{ width: '100%' }} placeholder={`Nhập ${element.ten?.toLocaleLowerCase()}`} />
							) : element.type === ELoaiDuLieuBieuMau.Date ? (
								<MyDatePicker />
							) : (
								<Input placeholder={`Nhập ${element.ten?.toLocaleLowerCase()}`} />
							)}
						</Form.Item>
					</Col>
				))}
			</Row>

			<div className='form-footer'>
				<Button loading={formSubmiting} htmlType='submit' type='primary'>
					{intl.formatMessage({ id: 'global.button.luulai' })}
				</Button>
				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
			</div>
		</Form>
	);
};

export default FormBienMucChiTiet;
