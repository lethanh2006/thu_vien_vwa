import { Card, Steps } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import ThongTinAnPham from '../ThongTinAnPham';
import FormAnPham from './Form';

const CardFormAnPham = (props: any) => {
	const { title } = props;
	const { record, edit } = useModel('sachtailieu.anpham.anpham');
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
				<Steps.Step title='Thông tin ấn phẩm' disabled={!record?._id} />
			</Steps>

			{currentStep === 0 ? (
				<FormAnPham afterAddNew={() => setCurrentStep(1)} />
			) : currentStep === 1 ? (
				<ThongTinAnPham />
			) : null}
		</Card>
	);
};

export default CardFormAnPham;
