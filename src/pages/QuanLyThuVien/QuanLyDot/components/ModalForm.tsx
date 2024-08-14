import { Card, Steps } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import FormQuanLyDot from './Form';
import DanhSachNop from '../DanhSachDot';

const ModalFormQuanLyDot = (props: any) => {
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
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()}`}>
			<Steps
				current={currentStep}
				type='navigation'
				style={{ marginBottom: 18, paddingTop: 0 }}
				onChange={record?._id ? onChangeStep : undefined}
			>
				<Steps.Step title='Thông tin chung' />
				<Steps.Step title='Danh sách nộp' disabled={!record?._id} />
			</Steps>

			{currentStep === 0 ? <FormQuanLyDot afterAddNew={() => setCurrentStep(1)} getData={getData} /> : <DanhSachNop />}
		</Card>
	);
};

export default ModalFormQuanLyDot;
