import { Button, Card, Steps, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useIntl, useModel } from 'umi';
import ChiTietAnPham from '../../AnPham/components/ChiTiet';
import FormItemTaiLieuSo from '../DanhSachTaiLieu/FormItem';
import ChiTietBienMuc from './ChiTiet';
import Form from './Form';
import FormBienMucChiTiet from './FormBienMucChiTiet';
import NoiDungSachHay from './NoiDungSachHay';

const ModalBienMucTaiLieu = (props: any) => {
	const { title, getData, isBienMuc } = props;
	const intl = useIntl();
	const { record, edit, isView, setVisibleForm, visibleForm } = useModel('sachtailieu.anpham.anpham');
	const { getAllModel, loading } = useModel('sachtailieu.anpham.thongtinanpham');
	const [currentStep, setCurrentStep] = useState(0);
	const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1200px)' });

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
			title={`${edit ? intl.formatMessage({ id: 'global.button.chinhsua' }) : isView ? intl.formatMessage({ id: 'global.button.chitiet' }) : intl.formatMessage({ id: 'global.button.themmoimoi' })} ${title?.toLowerCase()} ${intl.formatMessage({ id: 'sachtailieu.anpham.anPhamVatLy' })}`}
			loading={loading}
		>
			{isView ? (
				<>
					<Tabs tabPosition={isTabletOrMobile ? 'top' : 'left'}>
						<Tabs.TabPane tab={intl.formatMessage({ id: 'sachtailieu.anpham.thongTinChung' })} key='1'>
							<ChiTietBienMuc />
						</Tabs.TabPane>
						<Tabs.TabPane tab={intl.formatMessage({ id: 'sachtailieu.bienmuc.chiMucChiTiet' })} key='2'>
							<ChiTietAnPham />
						</Tabs.TabPane>
						{record?.online ? (
							<Tabs.TabPane tab={intl.formatMessage({ id: 'sachtailieu.anpham.fileAnPhamSo' })} key='3'>
								<FormItemTaiLieuSo disabled value={record?.thongTinAnPhamTrucTuyen} />
							</Tabs.TabPane>
						) : null}
						{record?.isSachHay ? (
							<Tabs.TabPane tab={intl.formatMessage({ id: 'sachtailieu.anpham.noiDungSachHay' })} key='4'>
								<NoiDungSachHay />
							</Tabs.TabPane>
						) : null}
					</Tabs>

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
						<Form afterAddNew={() => setCurrentStep(1)} getData={getData} />
					) : (
						<FormBienMucChiTiet getData={getData} isBienMuc={isBienMuc} />
					)}
				</>
			)}
		</Card>
	);
};

export default ModalBienMucTaiLieu;
