import { Card, Steps } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import ThongTinDuLieuBienMucPage from '../ThongTinDuLieu';
import FormMauBienMuc from './Form';

const ModalMauBienMuc = (props: any) => {
	const { title } = props;
	const { record, edit } = useModel('danhmuc.maubienmuc');
	const intl = useIntl();
	const [currentStep, setCurrentStep] = useState<number>(0);

	useEffect(() => {
		setCurrentStep(0);
	}, [record?._id]);

	const onChangeStep = (step: number) => {
		setCurrentStep(step);
	};

	return (
		<Card
			title={`${edit ? intl.formatMessage({ id: 'danhmuc.maubienmuc.form.title.chinhsua' }) : intl.formatMessage({ id: 'danhmuc.maubienmuc.form.title.themmoi' })} ${title?.toLowerCase()}`}
		>
			<Steps
				current={currentStep}
				type='navigation'
				style={{ marginBottom: 18, paddingTop: 0 }}
				onChange={record?._id ? onChangeStep : undefined}
			>
				<Steps.Step title={intl.formatMessage({ id: 'danhmuc.maubienmuc.modal.step.thongtinchung' })} />
				<Steps.Step
					title={intl.formatMessage({ id: 'danhmuc.maubienmuc.modal.step.cauhinhmaubienmuc' })}
					disabled={!record?._id}
				/>
			</Steps>

			{currentStep === 0 ? <FormMauBienMuc afterAddNew={() => setCurrentStep(1)} /> : <ThongTinDuLieuBienMucPage />}
		</Card>
	);
};

export default ModalMauBienMuc;
