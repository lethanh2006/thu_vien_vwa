import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import { ETrangThaiBienMuc } from '@/services/SachTaiLieu/constant';
import { buildUpLoadFile } from '@/services/uploadFile';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Form } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import BienMucSoLuoc from './BienMucSoLuoc';

const FormBienMucSachTaiLieu = (props: {
	afterAddNew: (rec: AnPham.IRecord) => void;
	tabActive: string;
	getData: () => void;
}) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const {
		record,
		setVisibleForm,
		edit,
		postBienMucSoLuocModel,
		putBienMucSoLuocModel,
		formSubmiting,
		setRecord,
		setEdit,
		visibleForm,
		setFormSubmiting,
	} = useModel('sachtailieu.anpham.anpham');
	const { getAllModel } = useModel('sachtailieu.anpham.thongtinanpham');
	const { record: recDot } = useModel('sachtailieu.anpham.dotnhapsach');
	const { initialState } = useModel('@@initialState');
	const { afterAddNew, tabActive, getData } = props;

	const fullName = initialState?.currentUser?.family_name
		? `${initialState?.currentUser.family_name} ${initialState?.currentUser?.given_name ?? ''}`
		: initialState?.currentUser?.name ?? (initialState?.currentUser?.preferred_username || '');

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
		} else if (record?._id) {
			form.setFieldsValue(record);
		}

		if (!record?._id) {
			form.setFieldsValue({
				online: tabActive === '1' ? false : true,
				dotNhapSachId: recDot?._id,
				canBoBienMuc: fullName,
			});
		}
	}, [record?._id, visibleForm]);

	const getDataThen = (rec: AnPham.IRecord) => {
		setRecord({ ...record, ...rec });
		setEdit(true);
		if (afterAddNew) afterAddNew(rec);
		getAllModel(undefined, undefined, { anPhamId: rec?._id });
	};

	const onFinish = async (values: AnPham.IRecord) => {
		setFormSubmiting(true);
		const urlScanBia = await buildUpLoadFile(values, 'urlScanBia').finally(() => setFormSubmiting(false));
		values.urlScanBia = urlScanBia ?? '';
		values.namXuatBan = Number(values.namXuatBan);
		if (edit) {
			putBienMucSoLuocModel(record?._id ?? '', values, getData)
				.then((rec) => getDataThen(rec))
				.catch((er) => console.log(er));
		} else
			postBienMucSoLuocModel({ ...values, trangThai: ETrangThaiBienMuc.CHO_BIEN_MUC }, getData)
				.then((rec) => getDataThen(rec))
				.catch((er) => console.log(er));
	};

	return (
		<Form onFinish={onFinish} form={form} layout='vertical'>
			<BienMucSoLuoc form={form} />
			<div className='form-footer'>
				<Button loading={formSubmiting} htmlType='submit' type='primary'>
					{!edit ? 'Biên mục' : `${intl.formatMessage({ id: 'global.button.luulai' })}`}
				</Button>
				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
			</div>
		</Form>
	);
};

export default FormBienMucSachTaiLieu;
