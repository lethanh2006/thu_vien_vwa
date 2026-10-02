import ButtonExtend from '@/components/Table/ButtonExtend';
import { ETrangThaiBienMuc } from '@/services/SachTaiLieu/constant';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Form, message, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import { buildDetailedCatalogRows, serializeDetailedCatalogRows } from '../utils/cataloging';
import BienMucChiTiet from './BienMucChiTiet';

const FormBienMucChiTiet = (props: any) => {
	const { getData, isBienMuc } = props;
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, setVisibleForm, putBienMucChiTietModel, formSubmiting, visibleForm } =
		useModel('sachtailieu.anpham.anpham');
	const { danhSach: dsMauBienMuc } = useModel('danhmuc.maubienmuc');
	const { danhSach, loading, loadedAnPhamId } = useModel('sachtailieu.anpham.thongtinanpham');
	const catalogReady = !!record?._id && !loading && loadedAnPhamId === record._id;

	const [actionType, setActionType] = useState<ETrangThaiBienMuc>(ETrangThaiBienMuc.CHO_BIEN_MUC);

	const mauBienMuc = dsMauBienMuc?.find((item) => item?._id === record?.mauBienMucId);

	useEffect(() => {
		setActionType(record?.trangThai ?? ETrangThaiBienMuc.CHO_BIEN_MUC);
	}, [visibleForm, record?._id]);

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
		} else if (record?._id) {
			const currentRows = danhSach.filter((item) => !item.anPhamId || item.anPhamId === record._id);
			form.setFieldsValue({
				danhSachBienMucChiTiet: buildDetailedCatalogRows(currentRows, mauBienMuc?.thongTinKhaiBao),
			});
		}
	}, [visibleForm, record?._id, record?.mauBienMucId, danhSach, mauBienMuc?.thongTinKhaiBao]);

	const onFinish = async (values: any) => {
		if (!catalogReady) {
			message.warning('Hãy tải lại dữ liệu biên mục trước khi lưu ấn phẩm.');
			return;
		}
		const data = {
			danhSachBienMucChiTiet: serializeDetailedCatalogRows(values.danhSachBienMucChiTiet),
			trangThai: actionType,
		};

		putBienMucChiTietModel(record?._id ?? '', data, getData)
			.then(() => {
				setVisibleForm(false);
			})
			.catch((er) => console.log(er));
	};

	return (
		<Spin spinning={loading}>
			<Form onFinish={onFinish} form={form} layout='vertical' autoComplete='off'>
				<BienMucChiTiet form={form} />

				<div className='form-footer'>
					{isBienMuc === true && (
						<ButtonExtend
							tooltip='Lưu thay đổi và giữ trạng thái biên mục hiện tại'
							loading={formSubmiting}
							disabled={!catalogReady}
							type='primary'
							onClick={() => {
								setActionType(record?.trangThai ?? ETrangThaiBienMuc.CHO_BIEN_MUC);
								form.submit();
							}}
						>
							Lưu lại
						</ButtonExtend>
					)}

					<ButtonExtend
						tooltip='Nếu hoàn thành ấn phẩm sẽ chuyển trạng thái đã biên mục chi tiết'
						loading={formSubmiting}
						disabled={!catalogReady}
						type='primary'
						onClick={() => {
							setActionType(ETrangThaiBienMuc.DA_BIEN_MUC);
							form.submit();
						}}
					>
						Hoàn thành
					</ButtonExtend>

					<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
		</Spin>
	);
};

export default FormBienMucChiTiet;
