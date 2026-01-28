import { Card, Steps } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import DanhSachNop from '../DanhSachDot';
import FormQuanLyDot from './Form';

const ModalFormQuanLyDot = (props: any) => {
	const intl = useIntl();
	const { title, getData } = props;
	const { record, edit } = useModel('quanlythuvien.quanlydot');
	const [currentStep, setCurrentStep] = useState<number>(0);

	useEffect(() => {
		setCurrentStep(0);
	}, [record?._id]);

	const onChangeStep = (step: number) => {
		setCurrentStep(step);
	};

	return (
		<Card
			title={`${edit ? intl.formatMessage({ id: 'global.button.chinhsua' }) : intl.formatMessage({ id: 'global.button.themmoi' })} ${title?.toLowerCase()}`}
		>
			<Steps
				current={currentStep}
				type='navigation'
				style={{ marginBottom: 18, paddingTop: 0 }}
				onChange={record?._id ? onChangeStep : undefined}
			>
				<Steps.Step title={intl.formatMessage({ id: 'luananluanvankhoaluan.label.thongTinChung' })} />
				<Steps.Step
					title={intl.formatMessage({ id: 'luananluanvankhoaluan.label.danhSachNop' })}
					disabled={!record?._id}
				/>
			</Steps>

			{currentStep === 0 ? <FormQuanLyDot afterAddNew={() => setCurrentStep(1)} getData={getData} /> : <DanhSachNop />}
		</Card>
	);
};

export default ModalFormQuanLyDot;
