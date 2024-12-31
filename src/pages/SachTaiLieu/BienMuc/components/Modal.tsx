import { Card, Steps } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import Form from './Form';
import FormBienMucChiTiet from './FormBienMucChiTiet';

const ModalBienMucTaiLieu = (props: any) => {
	const { title, getData } = props;
	const intl = useIntl();
	const { record, edit } = useModel('sachtailieu.anpham.anpham');
	const [currentStep, setCurrentStep] = useState(0);

	useEffect(() => {
		setCurrentStep(0);
	}, [record?._id]);

	const onChangeStep = (step: number) => {
		setCurrentStep(step);
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()}`}>
			<Steps
				current={currentStep}
				style={{ marginBottom: 18, paddingTop: 0 }}
				onChange={record?._id ? onChangeStep : undefined}
				type='navigation'
			>
				<Steps.Step title={intl.formatMessage({ id: 'sachtailieu.bienmuc.step1' })} />
				<Steps.Step title={intl.formatMessage({ id: 'sachtailieu.bienmuc.step2' })} disabled={!record?._id} />
			</Steps>

			{currentStep === 0 ? <Form afterAddNew={() => setCurrentStep(1)} getData={getData} /> : <FormBienMucChiTiet />}
		</Card>
	);
};

export default ModalBienMucTaiLieu;
