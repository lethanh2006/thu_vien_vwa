import { Alert, Button, Card, Steps, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useIntl, useModel } from 'umi';
import DanhSachDKCB from '../../AnPham/DanhSachDKCB';
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
	const { getAllModel, loading, catalogLoadError } = useModel('sachtailieu.anpham.thongtinanpham');
	const [currentStep, setCurrentStep] = useState(0);
	const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1200px)' });

	useEffect(() => {
		if (record?._id && visibleForm) {
			getAllModel(undefined, undefined, { anPhamId: record._id }).catch(() => undefined);
		}
	}, [visibleForm, record?._id]);

	useEffect(() => {
		setCurrentStep(0);
	}, [visibleForm]);

	const onChangeStep = (step: number) => {
		setCurrentStep(step);
	};

	return (
		<Card
			title={`${edit ? 'Chỉnh sửa' : isView ? 'Chi tiết' : 'Thêm mới'} ${title?.toLowerCase() ?? 'biên mục'} ${record?.online ? 'ấn phẩm số' : 'ấn phẩm vật lý'}`}
			loading={loading}
		>
			{record?._id && catalogLoadError ? (
				<Alert
					type='error'
					showIcon
					message={catalogLoadError}
					style={{ marginBottom: 18 }}
					action={
						<Button onClick={() => getAllModel(undefined, undefined, { anPhamId: record._id }).catch(() => undefined)}>
							Thử tải lại
						</Button>
					}
				/>
			) : null}
			{isView ? (
				<>
					<Tabs destroyInactiveTabPane tabPosition={isTabletOrMobile ? 'top' : 'left'}>
						<Tabs.TabPane tab='Thông tin chung' key='1'>
							<ChiTietBienMuc />
						</Tabs.TabPane>
						<Tabs.TabPane tab='Biên mục chi tiết' key='2'>
							<ChiTietAnPham />
						</Tabs.TabPane>
						<Tabs.TabPane tab='Danh sách đăng ký cá biệt' key='5'>
							<DanhSachDKCB onChanged={getData} />
						</Tabs.TabPane>
						{record?.online ? (
							<Tabs.TabPane tab='File ấn phẩm số' key='3'>
								<FormItemTaiLieuSo disabled value={record?.thongTinAnPhamTrucTuyen} />
							</Tabs.TabPane>
						) : null}
						{record?.isSachHay ? (
							<Tabs.TabPane tab='Nội dung sách hay' key='4'>
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
