import SelectAnPhamDebounce from '@/pages/SachTaiLieu/AnPham/components/Select';
import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import rules from '@/utils/rules';
import { inputFormat, resetFieldsForm } from '@/utils/utils';
import { Button, Form, Input, Modal, Select } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';

/** Thêm tay ĐKCB, truyền `anPham` khi thêm từ danh sách ĐKCB của ấn phẩm đó */
const ModalThemDKCB = (props: {
	visible: boolean;
	setVisible: (val: boolean) => void;
	anPham?: AnPham.IRecord;
	getData: () => void;
	getThongKe: () => void;
}) => {
	const { visible, setVisible, anPham, getData, getThongKe } = props;
	const intl = useIntl();
	const [form] = Form.useForm();
	const { postModel, formSubmiting } = useModel('sachtailieu.anpham.anphamxepgia');
	const { getAllModel: getAllXepGiaModel } = useModel('sachtailieu.anpham.xepgia');
	const [danhSachXepGia, setDanhSachXepGia] = useState<AnPham.IXepGia[]>([]);
	const anPhamIdChon: string = Form.useWatch('anPhamId', form);
	const anPhamId = anPham?._id ?? anPhamIdChon;

	useEffect(() => {
		if (!visible) resetFieldsForm(form);
	}, [visible]);

	// Dòng xếp giá của ấn phẩm để gắn ĐKCB
	useEffect(() => {
		setDanhSachXepGia([]);
		if (visible && anPhamId) {
			form.setFieldsValue({ thongTinXepGiaId: undefined });
			getAllXepGiaModel(false, undefined, { anPhamId }, undefined, undefined, false)
				.then((danhSach) => setDanhSachXepGia(danhSach))
				.catch((er) => console.log(er));
		}
	}, [visible, anPhamId]);

	const onFinish = (values: Partial<AnPham.IAnPhamXepGia>) => {
		postModel({ ...values, anPhamId }, getData, false)
			.then(() => {
				setVisible(false);
				getThongKe();
			})
			.catch((er) => console.log(er));
	};

	return (
		<Modal
			title={intl.formatMessage({ id: 'sachtailieu.dkcb.themTayDangKyCaBiet' })}
			open={visible}
			onCancel={() => setVisible(false)}
			footer={null}
			width={600}
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				{!anPham && (
					<Form.Item
						name='anPhamId'
						label={intl.formatMessage({ id: 'sachtailieu.anpham.title' })}
						rules={[...rules.required]}
					>
						<SelectAnPhamDebounce />
					</Form.Item>
				)}
				<Form.Item
					name='thongTinXepGiaId'
					label={intl.formatMessage({ id: 'sachtailieu.dkcb.dongXepGia' })}
					extra={intl.formatMessage({ id: 'sachtailieu.dkcb.moTaDongXepGia' })}
				>
					<Select
						allowClear
						options={danhSachXepGia.map((xepGia) => {
							const soBan = intl.formatMessage({ id: 'sachtailieu.dkcb.soBan' }, { soLuong: xepGia.soLuong });
							// Dòng xếp giá chưa nhập đơn giá thì không hiện giá
							const donGia = _.isNil(xepGia.donGia) ? '' : ` - ${inputFormat(xepGia.donGia)} VNĐ`;
							return { value: xepGia._id, label: `${xepGia.maKhoSach} - ${soBan}${donGia}` };
						})}
						placeholder={intl.formatMessage({ id: 'sachtailieu.dkcb.chonDongXepGia' })}
					/>
				</Form.Item>
				<Form.Item
					name='soDangKyCaBiet'
					label={intl.formatMessage({ id: 'sachtailieu.dkcb.soDangKyCaBiet' })}
					extra={intl.formatMessage({ id: 'sachtailieu.dkcb.moTaSoDKCB' })}
					rules={[...rules.required]}
				>
					<Input placeholder={intl.formatMessage({ id: 'sachtailieu.anpham.nhapDangKyCaBiet' })} />
				</Form.Item>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{intl.formatMessage({ id: 'global.button.themmoi' })}
					</Button>
					<Button onClick={() => setVisible(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default ModalThemDKCB;
