import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import { ETrangThaiBienMuc } from '@/services/SachTaiLieu/constant';
import { buildUpLoadFile } from '@/services/uploadFile';
import { resetFieldsForm } from '@/utils/utils';
import { Alert, Button, Form } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import BienMucSoLuoc from '../../components/BienMucSoLuoc';

const FormZ3950 = (props: { afterAddNew: (rec: AnPham.IRecord) => void; getData: () => void }) => {
	const { getData, afterAddNew } = props;
	const intl = useIntl();
	const [form] = Form.useForm();
	const {
		record,
		formSubmiting,
		setFormSubmiting,
		postBienMucSoLuocModel,
		visibleZ3950,
		setVisibleZ3950,
		setRecord,
		setEdit,
	} = useModel('sachtailieu.anpham.anpham');

	const { getAllModel } = useModel('sachtailieu.anpham.thongtinanpham');

	useEffect(() => {
		if (!visibleZ3950) {
			resetFieldsForm(form);
		} else {
			form.setFieldsValue(record);
		}
	}, [record, visibleZ3950]);

	const onFinish = async (values: AnPham.IRecord) => {
		setFormSubmiting(true);
		const urlScanBia = await buildUpLoadFile(values, 'urlScanBia').finally(() => setFormSubmiting(false));
		values.urlScanBia = urlScanBia ?? '';
		values.namXuatBan = Number(values.namXuatBan);

		postBienMucSoLuocModel({ ...values, trangThai: ETrangThaiBienMuc.CHO_BIEN_MUC }, getData)
			.then((rec) => {
				setRecord({ ...record, ...rec });
				setEdit(true);
				if (afterAddNew) afterAddNew(rec);
				getAllModel(undefined, undefined, { anPhamId: rec?._id });
			})
			.catch((er) => console.log(er));
	};

	return (
		<Form onFinish={onFinish} form={form} layout='vertical'>
			<Alert
				style={{ marginBottom: 12 }}
				type='info'
				showIcon
				message='Để tránh mất dữ liệu khi biên mục, lưu ý không tắt form hoặc tải lại trang trong khi chưa hoàn thành biên mục chi tiết!'
			/>
			<BienMucSoLuoc form={form} />
			<div className='form-footer'>
				<Button loading={formSubmiting} htmlType='submit' type='primary'>
					Biên mục
				</Button>
				<Button onClick={() => setVisibleZ3950(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
			</div>
		</Form>
	);
};

export default FormZ3950;
