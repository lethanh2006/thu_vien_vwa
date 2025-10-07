import ButtonExtend from '@/components/Table/ButtonExtend';
import { ETrangThaiGhiNhanAnPhamDinhKy } from '@/services/AnPhamDinhKy/constant';
import type { AnPhamDinhKy } from '@/services/AnPhamDinhKy/typing';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Descriptions, Divider, Form, Modal, Row, Spin, Tabs } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import GhiNhanAnPhamDinhKyPage from '../../GhiNhan';
import FormGhiNhanAnPham from '../../GhiNhan/components/Form';

const ModalGhiNhanAnPhamDinhKy = (props: { visible: boolean; setVisible: (val: boolean) => void }) => {
	const { visible, setVisible } = props;
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record: recAnPhanDinhKy } = useModel('anphamdinhky.anphamdinhky');
	const { formSubmiting, postModel, getAllModel, loading } = useModel('anphamdinhky.ghinhan');
	const [actionType, setActionType] = useState<ETrangThaiGhiNhanAnPhamDinhKy>();
	const [tabActive, setTabActive] = useState<string>('1');
	const [dataThongKe, setThongKeData] = useState<AnPhamDinhKy.GhiNhanAnPhamDinhKy[]>([]);

	const getThongKeAnPhamDinhKy = () => {
		getAllModel(undefined, undefined, { anPhamDinhKyId: recAnPhanDinhKy?._id }, undefined, undefined, false).then(
			(res) => setThongKeData(res),
		);
	};

	useEffect(() => {
		if (!visible) {
			resetFieldsForm(form);
		} else if (recAnPhanDinhKy?._id) {
			getThongKeAnPhamDinhKy();

			form.setFieldsValue({
				ngayGhiNhan: moment(),
			});
		}
	}, [visible, recAnPhanDinhKy?._id]);

	const onFinish = async (values: AnPhamDinhKy.GhiNhanAnPhamDinhKy) => {
		postModel(
			{
				...values,
				ngayGhiNhan: moment(values.ngayGhiNhan).startOf('d').toISOString(),
				trangThaiGhiNhan: actionType,
				anPhamDinhKyId: recAnPhanDinhKy?._id,
			},
			() => {
				getThongKeAnPhamDinhKy();
				resetFieldsForm(form, { ngayGhiNhan: moment() });
				setTabActive('2');
			},
			false,
			'Lưu thành công',
		)
			.then()
			.catch((er) => console.log(er));
	};

	return (
		<Modal
			title='Ghi nhận'
			visible={visible}
			onCancel={() => setVisible(false)}
			footer={null}
			width={1000}
			destroyOnClose
		>
			<Spin spinning={loading}>
				<Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
					<Col span={12} md={12}>
						<Card className='card-stat-small'>
							<span className='num' style={{ color: 'blue' }}>
								{dataThongKe?.filter((item) => item?.trangThaiGhiNhan === ETrangThaiGhiNhanAnPhamDinhKy.DANG_GHI_NHAN)
									?.length ?? '--'}
							</span>
							<span>Đang ghi nhận</span>
						</Card>
					</Col>
					<Col span={12} md={12}>
						<Card className='card-stat-small'>
							<span className='num' style={{ color: 'green' }}>
								{dataThongKe?.filter((item) => item?.trangThaiGhiNhan === ETrangThaiGhiNhanAnPhamDinhKy.DA_GHI_NHAN)
									?.length ?? '--'}
							</span>
							<span>Đã ghi nhận</span>
						</Card>
					</Col>
				</Row>
			</Spin>

			<Tabs onChange={(tab) => setTabActive(tab)} activeKey={tabActive}>
				<Tabs.TabPane tab='Ghi nhận' key='1' />
				<Tabs.TabPane tab='Lịch sử ghi nhận' key='2' />
			</Tabs>

			{tabActive === '1' ? (
				<Form onFinish={onFinish} form={form} layout='vertical'>
					<Row gutter={[12, 0]}>
						<Col span={24}>
							<Descriptions column={1}>
								<Descriptions.Item label='Mã ấn phẩm định kỳ'>
									{recAnPhanDinhKy?.maAnPhamDinhKy ?? ''}
								</Descriptions.Item>
								<Descriptions.Item label='Tên ấn phẩm định kỳ'>{recAnPhanDinhKy?.ten ?? ''}</Descriptions.Item>
							</Descriptions>
						</Col>
						<Col span={24}>
							<Divider>Thông tin ghi nhận</Divider>
						</Col>
						<FormGhiNhanAnPham />
					</Row>

					<div className='form-footer'>
						<ButtonExtend
							loading={formSubmiting}
							type='primary'
							onClick={() => {
								setActionType(ETrangThaiGhiNhanAnPhamDinhKy.DANG_GHI_NHAN);
								form.submit();
							}}
						>
							Lưu lại
						</ButtonExtend>

						<ButtonExtend
							loading={formSubmiting}
							type='primary'
							onClick={() => {
								setActionType(ETrangThaiGhiNhanAnPhamDinhKy.DA_GHI_NHAN);
								form.submit();
							}}
						>
							Ghi nhận
						</ButtonExtend>

						<Button onClick={() => setVisible(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
					</div>
				</Form>
			) : (
				<GhiNhanAnPhamDinhKyPage type='lich_su' getData={getThongKeAnPhamDinhKy} />
			)}
		</Modal>
	);
};

export default ModalGhiNhanAnPhamDinhKy;
