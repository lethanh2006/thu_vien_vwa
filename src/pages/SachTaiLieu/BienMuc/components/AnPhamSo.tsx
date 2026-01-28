import SelectBoSuuTap from '@/pages/DanhMuc/DonViSo/components/SelectBoSuuTap';
import SelectDonViSo from '@/pages/DanhMuc/DonViSo/components/SelectDonViSo';
import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Form, Modal, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import FormItemTaiLieuSo from '../DanhSachTaiLieu/FormItem';

const ModalAnPhamSo = (props: { visible: boolean; setVisible: (val: boolean) => void; getData: () => void }) => {
	const intl = useIntl();
	const { visible, setVisible, getData } = props;
	const [form] = Form.useForm();
	const communityId: string = Form.useWatch('communityId', form);
	const { record, formSubmiting, putAnPhamSoModel } = useModel('sachtailieu.anpham.anpham');

	useEffect(() => {
		if (!visible) {
			resetFieldsForm(form);
		} else {
			form.setFieldsValue(record);
		}
	}, [record?._id, visible]);

	const onFinish = async (values: AnPham.IRecord) => {
		putAnPhamSoModel(record?._id ?? '', values, getData)
			.then(() => setVisible(false))
			.catch((err) => console.log(err));
	};

	return (
		<Modal
			title={intl.formatMessage({ id: 'sachtailieu.anpham.themMoi' })}
			open={visible}
			onCancel={() => setVisible(false)}
			footer={null}
			width={800}
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col xs={24} md={12}>
						<Form.Item
							name='communityId'
							label={intl.formatMessage({ id: 'sachtailieu.anpham.donViSo' })}
							rules={[...rules.required]}
						>
							<SelectDonViSo />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item
							name='collectionId'
							label={intl.formatMessage({ id: 'sachtailieu.anpham.boSuuTap' })}
							rules={[...rules.required]}
						>
							<SelectBoSuuTap idDonViSo={communityId} />
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item
							name='thongTinAnPhamTrucTuyen'
							label={intl.formatMessage({ id: 'sachtailieu.anpham.danhSachTaiLieuAnPhamSo' })}
							rules={[...rules.required]}
						>
							<FormItemTaiLieuSo />
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{intl.formatMessage({ id: 'global.button.luulai' })}
					</Button>
					<Button onClick={() => setVisible(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default ModalAnPhamSo;
