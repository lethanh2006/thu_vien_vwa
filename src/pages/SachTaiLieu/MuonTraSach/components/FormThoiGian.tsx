import MyDatePicker from '@/components/MyDatePicker';
import type { MuonSach } from '@/services/SachTaiLieu/MuonSach/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormThoiGianMuonTra = (props: any) => {
	const { getData } = props;
	const intl = useIntl();
	const [form] = Form.useForm();
	const { putModel, visibleForm, setVisibleForm, record } = useModel('sachtailieu.muontra.muontra');

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
		} else if (record?._id) {
			form.setFieldsValue(record);
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: MuonSach.IRecord) => {
		putModel(record?._id ?? '', values, getData)
			.then()
			.catch((err) => console.log(err));
	};

	return (
		<Card title={intl.formatMessage({ id: 'sachtailieu.formthoigian.title' })}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col xs={24}>
						<Form.Item
							name='thoiGianMuon'
							label={intl.formatMessage({ id: 'sachtailieu.dkcb.thoiGianMuon' })}
							rules={[...rules.required]}
						>
							<MyDatePicker />
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item
							name='expired'
							label={intl.formatMessage({ id: 'sachtailieu.dkcb.hanTra' })}
							rules={[...rules.required]}
						>
							<MyDatePicker />
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item name='ghiChu' label={intl.formatMessage({ id: 'sachtailieu.anpham.ghiChu' })}>
							<Input.TextArea rows={3} placeholder={intl.formatMessage({ id: 'sachtailieu.anpham.nhapGhiChu' })} />
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button htmlType='submit' type='primary'>
						{intl.formatMessage({ id: 'global.button.luulai' })}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormThoiGianMuonTra;
