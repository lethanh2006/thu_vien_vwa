import { Col, Form, Row } from 'antd';

const InMaVachPage = () => {
	const [form] = Form.useForm();
	const onFinish = async (values: any) => {};

	return (
		<div>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 12]}>
					<Col></Col>
				</Row>
			</Form>
		</div>
	);
};

export default InMaVachPage;
