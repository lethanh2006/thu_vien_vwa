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
			title='Cấu hình thời hạn trả sách'
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
									<Divider>Sinh viên</Divider>
								</Col>
								<Col span={24}>
									<Form.Item
										name='thoiHanMuonTraSach'
										label='Thời hạn mượn trả sách mặc định'
										rules={[...rules.required]}
									>
										<InputNumber style={{ width: '100%' }} placeholder='Nhập hạn mượn trả sách' addonAfter='Ngày' />
									</Form.Item>
								</Col>
								<Col span={24}>
									<Form.Item name='soLuongMuonToiDa' label='Hạn ngạch mượn' rules={[...rules.required]}>
										<InputNumber style={{ width: '100%' }} placeholder='Nhập số hạn ngạch mượn' />
									</Form.Item>
								</Col>
							</Row>
						</Col>
						<Col span={24} md={12}>
							<Row gutter={[12, 0]}>
								<Col span={24}>
									<Divider>Cán bộ/Giảng viên</Divider>
								</Col>
								<Col span={24}>
									<Form.Item
										name='thoiHanMuonTraSachCanBo'
										label='Thời hạn mượn trả sách mặc định'
										rules={[...rules.required]}
									>
										<InputNumber style={{ width: '100%' }} placeholder='Nhập hạn mượn trả sách' addonAfter='Ngày' />
									</Form.Item>
								</Col>
								<Col span={24}>
									<Form.Item name='soLuongMuonToiDaCanBo' label='Hạn ngạch mượn' rules={[...rules.required]}>
										<InputNumber style={{ width: '100%' }} placeholder='Nhập số hạn ngạch mượn' />
									</Form.Item>
								</Col>
							</Row>
						</Col>
						<Col span={24}>
							<Form.Item name='idDonViThuVien' label='Đơn vị nhận thông báo' rules={[...rules.required]}>
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
