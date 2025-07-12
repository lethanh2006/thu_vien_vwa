import ButtonExtend from '@/components/Table/ButtonExtend';
import { ETrangThaiBienMuc } from '@/services/SachTaiLieu/constant';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Form, Spin } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { history, useIntl, useModel } from 'umi';
import BienMucChiTiet from '../../components/BienMucChiTiet';

const FormBienMucChiTietZ3950 = (props: any) => {
	const { getData } = props;
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, visibleZ3950, setVisibleZ3950, putBienMucChiTietModel, formSubmiting, setVisibleTimKiemZ3950 } =
		useModel('sachtailieu.anpham.anpham');
	const { danhSach: dsMauBienMuc } = useModel('danhmuc.maubienmuc'); //Lấy thông tin từ mẫu biên mục
	const { danhSach: dsThongTinAnPham, loading: loadingThongTin } = useModel('sachtailieu.anpham.thongtinanpham'); //Lấy thông tin từ biên mục sơ lược
	const {
		danhSach: dsTruongBienMuc,
		getAllModel: getAllTruongBienMuc,
		loading: loadingTruongBienMuc,
	} = useModel('danhmuc.truongbienmuc'); //Lấy tên để điền vào biên mục

	const [actionType, setActionType] = useState<ETrangThaiBienMuc>(ETrangThaiBienMuc.CHO_BIEN_MUC);

	const mauBienMuc = dsMauBienMuc?.find((item) => item?._id === record?.mauBienMucId);

	useEffect(() => {
		if (!dsTruongBienMuc?.length) {
			getAllTruongBienMuc(undefined, undefined, undefined, undefined, undefined, undefined, undefined, {
				population: [
					{
						path: 'thuocTinh',
					},
				],
			});
		}
	}, []);

	useEffect(() => {
		if (!visibleZ3950) {
			resetFieldsForm(form);
		} else if (record?._id) {
			const recordThongTinMap = new Map(record?.danhSachThongTin?.map((item) => [item.tagCode, item]) || []);

			const truongBienMucMap = new Map(dsTruongBienMuc?.map((item) => [item.ma, item]) || []);

			const mergedData = [
				// 1. dsThongTinAnPham (ưu tiên cao nhất)
				...(dsThongTinAnPham?.map((item) => ({
					...item,
					ten: item.tag?.noiDung,
					thuocTinhAnPham: item.thuocTinhAnPham?.map((tp) => ({
						...tp,
						value: tp.value ?? null,
						ten: item.tag?.thuocTinh?.find((i) => i.code === tp.code)?.tieuDe,
					})),
				})) || []),

				// 2. Xử lý mauBienMuc.thongTinKhaiBao kết hợp với record.danhSachThongTin
				...(mauBienMuc?.thongTinKhaiBao
					?.filter((item) => !dsThongTinAnPham.some((ds) => ds.tagCode === item.tag))
					?.map((item) => {
						const recordItem = recordThongTinMap.get(item.tag);
						const truongBienMuc = truongBienMucMap.get(item.tag);

						// Nếu có trong record thì ưu tiên lấy giá trị từ record
						if (recordItem) {
							return {
								...recordItem,
								id: null,
								ten: truongBienMuc?.noiDung || item.ten,
								thuocTinhAnPham:
									item.thuocTinhDuLieu?.map((tp) => {
										const recordTp = recordItem.thuocTinhAnPham?.find((r) => r.code === tp.code);
										return {
											...tp,
											value: recordTp?.value ?? null,
											ten: tp.ten,
										};
									}) || [],
							};
						}

						// Nếu không có trong record thì tạo mới với value = null
						return {
							_id: null,
							tagCode: item.tag,
							ten: truongBienMuc?.noiDung || item.ten,
							thuocTinhAnPham:
								item.thuocTinhDuLieu?.map((tp) => ({
									...tp,
									value: null,
									ten: tp.ten,
								})) || [],
						};
					}) || []),

				// 3. Xử lý các record.danhSachThongTin chưa được xử lý
				...(record?.danhSachThongTin
					?.filter(
						(item) =>
							!dsThongTinAnPham.some((ds) => ds.tagCode === item.tagCode) &&
							!mauBienMuc?.thongTinKhaiBao?.some((m) => m.tag === item.tagCode),
					)
					?.map((item) => {
						const truongBienMuc = truongBienMucMap.get(item.tagCode ?? '');
						return {
							...item,
							id: null,
							ten: truongBienMuc?.noiDung,
							thuocTinhAnPham:
								item.thuocTinhAnPham?.map((tp) => ({
									...tp,
									value: tp.value ?? null,
									ten: truongBienMuc?.thuocTinh?.find((i) => i.code === tp.code)?.tieuDe,
								})) || [],
						};
					}) || []),
			];

			form.setFieldsValue({
				danhSachBienMucChiTiet: _.orderBy(mergedData, 'tagCode'),
			});
		}
	}, [visibleZ3950, JSON.stringify(dsThongTinAnPham)]);

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
				setVisibleZ3950(false);
				setVisibleTimKiemZ3950(false);
				if (actionType === ETrangThaiBienMuc.DA_BIEN_MUC) {
					history.push('/sach-tai-lieu/an-pham');
				}
			})
			.catch((er) => console.log(er));
	};

	return (
		<Spin spinning={loadingThongTin || loadingTruongBienMuc}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<BienMucChiTiet form={form} />

				<div className='form-footer'>
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

					<Button onClick={() => setVisibleZ3950(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
		</Spin>
	);
};

export default FormBienMucChiTietZ3950;
