import { Button, Card, Steps, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import ChiTietAnPham from '../../AnPham/components/ChiTiet';
import FormItemTaiLieuSo from '../DanhSachTaiLieu/FormItem';
import ChiTietBienMuc from './ChiTiet';
import Form from './Form';
import FormBienMucChiTiet from './FormBienMucChiTiet';

const ModalBienMucTaiLieu = (props: any) => {
	const { title, getData, tabActive: tabActiveExternal } = props;
	const intl = useIntl();
	const { record, edit, isView, setVisibleForm, visibleForm } = useModel('sachtailieu.anpham.anpham');
	const { getAllModel, loading } = useModel('sachtailieu.anpham.thongtinanpham');
	const [currentStep, setCurrentStep] = useState(0);
	const [tabActive, setTabActive] = useState<string>('1');

	useEffect(() => {
		if (record?._id && visibleForm) getAllModel(undefined, undefined, { anPhamId: record?._id });
	}, [visibleForm]);

	useEffect(() => {
		setCurrentStep(0);
	}, [visibleForm]);

	const onChangeStep = (step: number) => {
		setCurrentStep(step);
	};

	return (
		<Card
			title={`${edit ? 'Chỉnh sửa' : isView ? 'Chi tiết' : 'Thêm mới'} ${title?.toLowerCase()} ${
				tabActive === '1' ? 'ấn phẩm vật lý' : 'ấn phẩm số'
			}`}
			loading={loading}
		>
			{isView ? (
				<>
					<Tabs onChange={(tab) => setTabActive(tab)} activeKey={tabActive}>
						<Tabs.TabPane tab='Thông tin chung' key='1' />
						<Tabs.TabPane tab='Biên mục chi tiết' key='2' />
						{record?.online ? <Tabs.TabPane tab='File ấn phẩm số' key='3' /> : null}
					</Tabs>
					{tabActive === '1' ? (
						<ChiTietBienMuc />
					) : tabActive === '2' ? (
						<ChiTietAnPham />
					) : (
						<FormItemTaiLieuSo disabled value={record?.thongTinAnPhamTrucTuyen} />
					)}

					<div className='form-footer'>
						<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
					</div>
				</>
			) : (
				<>
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
						<Form afterAddNew={() => setCurrentStep(1)} tabActive={tabActiveExternal} />
					) : (
						<FormBienMucChiTiet getData={getData} />
					)}
				</>
			)}
		</Card>
	);
};

export default ModalBienMucTaiLieu;
