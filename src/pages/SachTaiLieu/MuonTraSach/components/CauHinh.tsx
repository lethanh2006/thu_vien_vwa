import SelectDonVi from '@/pages/ToChucNhanSu/DonVi/Select';
import type { MuonSach } from '@/services/SachTaiLieu/MuonSach/typing';
import rules from '@/utils/rules';
import { Button, Col, Divider, Form, InputNumber, Modal, Row, Spin } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const CauHinhThoiHanMuonTra = (props: { visible: boolean; setVisible: (val: boolean) => void }) => {
	const intl = useIntl();
	const { visible, setVisible } = props;
	const { updateSettingModel, formSubmiting, loading, settingMuonTra } = useModel('sachtailieu.muontra.muontra');
	const [form] = Form.useForm();

	useEffect(() => {
		if (settingMuonTra) form.setFieldsValue(settingMuonTra);
	}, [visible]);

	const onFinish = (value: MuonSach.TSetting) => {
		updateSettingModel(value)
			.then(() => setVisible(false))
			.catch((er) => console.log(er));
	};

	return (
		<Modal
			title={intl.formatMessage({ id: 'sachtailieu.muontra.cauhinh.title' })}
			open={visible}
			onCancel={() => setVisible(false)}
			footer={null}
			width={800}
		>
			<Spin spinning={loading}>
				<Form form={form} layout='vertical' onFinish={onFinish}>
					<Row gutter={[12, 0]}>
						<Col span={24} md={12}>
							<Row gutter={[12, 0]}>
								<Col span={24}>
									<Divider>{intl.formatMessage({ id: 'sachtailieu.sinhVien.title' })}</Divider>
								</Col>
								<Col span={24}>
									<Form.Item
										name='thoiHanMuonTraSach'
										label={intl.formatMessage({ id: 'sachtailieu.muontra.cauhinh.thoihanmuontra' })}
										rules={[...rules.required]}
									>
										<InputNumber
											style={{ width: '100%' }}
											placeholder={intl.formatMessage({ id: 'sachtailieu.muontra.cauhinh.nhapthoihan' })}
											addonAfter='Ngày'
										/>
									</Form.Item>
								</Col>
								<Col span={24}>
									<Form.Item
										name='soLuongMuonToiDa'
										label={intl.formatMessage({ id: 'sachtailieu.muontra.cauhinh.hanngachmuon' })}
										rules={[...rules.required]}
									>
										<InputNumber
											style={{ width: '100%' }}
											placeholder={intl.formatMessage({ id: 'sachtailieu.muontra.cauhinh.nhapsohanngach' })}
										/>
									</Form.Item>
								</Col>
							</Row>
						</Col>
						<Col span={24} md={12}>
							<Row gutter={[12, 0]}>
								<Col span={24}>
									<Divider>{intl.formatMessage({ id: 'sachtailieu.canBo.title' })}</Divider>
								</Col>
								<Col span={24}>
									<Form.Item
										name='thoiHanMuonTraSachCanBo'
										label={intl.formatMessage({ id: 'sachtailieu.muontra.cauhinh.thoihanmuontra' })}
										rules={[...rules.required]}
									>
										<InputNumber
											style={{ width: '100%' }}
											placeholder={intl.formatMessage({ id: 'sachtailieu.muontra.cauhinh.nhapthoihan' })}
											addonAfter='Ngày'
										/>
									</Form.Item>
								</Col>
								<Col span={24}>
									<Form.Item
										name='soLuongMuonToiDaCanBo'
										label={intl.formatMessage({ id: 'sachtailieu.muontra.cauhinh.hanngachmuon' })}
										rules={[...rules.required]}
									>
										<InputNumber
											style={{ width: '100%' }}
											placeholder={intl.formatMessage({ id: 'sachtailieu.muontra.cauhinh.nhapsohanngach' })}
										/>
									</Form.Item>
								</Col>
							</Row>
						</Col>
						<Col span={24}>
							<Form.Item
								name='idDonViThuVien'
								label={intl.formatMessage({ id: 'sachtailieu.muontra.cauhinh.donvinhanthongbao' })}
								rules={[...rules.required]}
							>
								<SelectDonVi />
							</Form.Item>
						</Col>
					</Row>

					<div className='form-footer'>
						<Button type='primary' htmlType='submit' loading={formSubmiting}>
							{intl.formatMessage({ id: 'global.button.luulai' })}
						</Button>
						<Button onClick={() => setVisible(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
					</div>
				</Form>
			</Spin>
		</Modal>
	);
};

export default CauHinhThoiHanMuonTra;
