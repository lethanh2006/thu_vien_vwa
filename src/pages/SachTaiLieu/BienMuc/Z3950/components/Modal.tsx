import { Modal, Steps } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import FormZ3950 from './Form';
import FormBienMucChiTietZ3950 from './FormChiTiet';

const ModalBienMucZ3950 = (props: any) => {
	const { getData } = props;
	const intl = useIntl();
	const { visibleZ3950, setVisibleZ3950, record } = useModel('sachtailieu.anpham.anpham');
	const [currentStep, setCurrentStep] = useState(0);

	useEffect(() => {
		setCurrentStep(0);
	}, [visibleZ3950]);

	const onChangeStep = (step: number) => {
		setCurrentStep(step);
	};

	return (
		<Modal
			title='Biên mục qua Z39.50'
			width={1200}
			open={visibleZ3950}
			onCancel={() => setVisibleZ3950(false)}
			footer={null}
		>
			<Steps
				current={currentStep}
				style={{ marginBottom: 18, paddingTop: 0 }}
				onChange={record?._id ? onChangeStep : undefined}
				type='navigation'
			>
				<Steps.Step title={intl.formatMessage({ id: 'sachtailieu.bienmuc.step1' })} />
				<Steps.Step title={intl.formatMessage({ id: 'sachtailieu.bienmuc.step2' })} disabled={!record?._id} />
			</Steps>

			{currentStep === 0 ? (
				<FormZ3950 afterAddNew={() => setCurrentStep(1)} getData={getData} />
			) : (
				<FormBienMucChiTietZ3950 getData={getData} />
			)}
		</Modal>
	);
};

export default ModalBienMucZ3950;
