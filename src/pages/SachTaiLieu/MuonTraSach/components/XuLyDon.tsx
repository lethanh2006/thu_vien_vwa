import { ETrangThaiDuyeMuonSach } from '@/services/SachTaiLieu/constant';
import rules from '@/utils/rules';
import { Button, Col, Form, Input, Modal, Row } from 'antd';
import { useIntl, useModel } from 'umi';
import SelectThongTinAnPhamDebounce from '../../AnPham/ThongTinAnPham/components/Select';

const XuLyDonMuonTra = (props: {
	trangThai?: ETrangThaiDuyeMuonSach;
	visible: boolean;
	setVisible: (val: boolean) => void;
	getData?: () => void;
}) => {
	const intl = useIntl();
	const { trangThai, visible, setVisible, getData } = props;
	const [form] = Form.useForm();

	const { record, xuLyMuonTraSachModel, formSubmiting } = useModel('sachtailieu.muontra.muontra');

	const onFinish = async (values: any) => {
		const data = {
			danhSachThongTinAnPhamId: values.danhSachThongTinAnPhamId ?? [],
			trangThaiDuyet: trangThai,
			ghiChu: values.ghiChu,
		};
		xuLyMuonTraSachModel(record?._id ?? '', data as any, getData)
			.then(() => {
				setVisible(false);
			})
			.catch((err) => console.log(err));
	};

	return (
		<Modal title='Xử lý mượn trả sách' visible={visible} onCancel={() => setVisible(false)} footer={null}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					{trangThai === ETrangThaiDuyeMuonSach.DA_DUYET ? (
						<Col xs={24}>
							<Form.Item name='danhSachThongTinAnPhamId' label='Thông tin ấn phẩm cho mượn' rules={[...rules.required]}>
								<SelectThongTinAnPhamDebounce
									// condition={{ tagCode: record?.soDangKyCaBiet }}
									multiple
								/>
							</Form.Item>
						</Col>
					) : null}

					<Col xs={24}>
						<Form.Item name='ghiChu' label='Ghi chú' rules={[...rules.text]}>
							<Input.TextArea rows={3} placeholder='Nhập ghi chú' />
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						Xử lý
					</Button>
					<Button onClick={() => setVisible(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default XuLyDonMuonTra;
