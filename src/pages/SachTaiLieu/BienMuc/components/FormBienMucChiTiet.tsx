import ButtonExtend from '@/components/Table/ButtonExtend';
import { ETrangThaiBienMuc } from '@/services/SachTaiLieu/constant';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Form, Spin } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { history, useIntl, useModel } from 'umi';
import BienMucChiTiet from './BienMucChiTiet';

const FormBienMucChiTiet = (props: any) => {
	const { getData, isBienMuc } = props;
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, setVisibleForm, putBienMucChiTietModel, formSubmiting, visibleForm } =
		useModel('sachtailieu.anpham.anpham');
	const { danhSach: dsMauBienMuc } = useModel('danhmuc.maubienmuc');
	const { danhSach, loading } = useModel('sachtailieu.anpham.thongtinanpham');

	const [actionType, setActionType] = useState<ETrangThaiBienMuc>(ETrangThaiBienMuc.CHO_BIEN_MUC);

	const mauBienMuc = dsMauBienMuc?.find((item) => item?._id === record?.mauBienMucId);

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
		} else if (record?._id) {
			const danhSachTags = danhSach.map((dsItem) => dsItem.tagCode);

			const khaiBaoMauBienMuc = (mauBienMuc?.thongTinKhaiBao || []).filter((item) => !danhSachTags.includes(item.tag));

			const mergedData = [
				...(danhSach ?? []).map((item) => ({
					...item,
					ten: item.tag?.noiDung,
					thuocTinhAnPham: item?.thuocTinhAnPham?.map((tp) => ({
						...tp,
						value: tp.value ?? null,
						ten: item?.tag?.thuocTinh?.find((i) => i?.code === tp?.code)?.tieuDe,
					})),
				})),
				...(khaiBaoMauBienMuc ?? []).map((item) => ({
					_id: null,
					tagCode: item.tag,
					ten: item.ten,
					thuocTinhAnPham: (item?.thuocTinhDuLieu || []).map((tp) => ({
						...tp,
						value: null,
						ten: tp.ten,
					})),
				})),
			];

			form.setFieldsValue({ danhSachBienMucChiTiet: _.orderBy(mergedData, 'tagCode') });
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		const data = {
			danhSachBienMucChiTiet: values.danhSachBienMucChiTiet.map((item: any) => ({
				_id: item._id,
				ind1: item.ind1,
				ind2: item.ind2,
				tagCode: item.tagCode,
				value: item.value,
				thuocTinhAnPham: (item.thuocTinhAnPham || []).map((thuocTinh: any) => ({
					code: thuocTinh.code,
					value: thuocTinh.value ?? '',
				})),
			})),
			trangThai: actionType,
		};

		putBienMucChiTietModel(record?._id ?? '', data, getData)
			.then(() => {
				setVisibleForm(false);
				if (actionType === ETrangThaiBienMuc.DA_BIEN_MUC) {
					history.push('/sach-tai-lieu/an-pham');
				}
			})
			.catch((er) => console.log(er));
	};

	return (
		<Spin spinning={loading}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<BienMucChiTiet form={form} />

				<div className='form-footer'>
					{isBienMuc === true && (
						<ButtonExtend
							tooltip='Nếu lưu lại ấn phẩm sẽ ở vẫn trạng thái chờ biên mục chi tiết'
							loading={formSubmiting}
							type='primary'
							onClick={() => {
								setActionType(ETrangThaiBienMuc.CHO_BIEN_MUC);
								form.submit();
							}}
						>
							Lưu lại
						</ButtonExtend>
					)}

					<ButtonExtend
						tooltip='Nếu hoàn thành ấn phẩm sẽ chuyển trạng thái đã biên mục chi tiết'
						loading={formSubmiting}
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
