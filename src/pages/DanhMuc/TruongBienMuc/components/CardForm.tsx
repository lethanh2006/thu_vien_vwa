import { Card, Steps } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import DanhSachTruongCon from '../TruongCon';
import FormTruongBienMuc from './Form';

const CardFormTruongBienMuc = (props: any) => {
	const { title, getData } = props;
	const { record, edit } = useModel('danhmuc.truongbienmuc');
	const [currentStep, setCurrentStep] = useState<number>(0);

	const intl = useIntl();

	useEffect(() => {
		setCurrentStep(0);
	}, [record?._id]);

	const onChangeStep = (step: number) => {
		setCurrentStep(step);
	};

	return (
		<Card
			title={`${edit ? intl.formatMessage({ id: 'danhmuc.truongbienmuc.form.title.chinhsua' }) : intl.formatMessage({ id: 'danhmuc.truongbienmuc.form.title.themmoi' })} ${title?.toLowerCase()}`}
		>
			<Steps
				current={currentStep}
				type='navigation'
				style={{ marginBottom: 18, paddingTop: 0 }}
				onChange={record?._id ? onChangeStep : undefined}
			>
				<Steps.Step title={intl.formatMessage({ id: 'danhmuc.truongbienmuc.cardform.step.thongtinchung' })} />
				<Steps.Step
					title={intl.formatMessage({ id: 'danhmuc.truongbienmuc.cardform.step.danhsachtruongcon' })}
					disabled={!record?._id}
				/>
			</Steps>

			{currentStep === 0 ? (
				<FormTruongBienMuc afterAddNew={() => setCurrentStep(1)} getData={getData} />
			) : (
				<DanhSachTruongCon />
			)}
		</Card>
	);
};

export default CardFormTruongBienMuc;
