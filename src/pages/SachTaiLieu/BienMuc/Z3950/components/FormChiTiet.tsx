import ButtonExtend from '@/components/Table/ButtonExtend';
import { ETrangThaiBienMuc } from '@/services/SachTaiLieu/constant';
import { resetFieldsForm } from '@/utils/utils';
import { Alert, Button, Form, Spin } from 'antd';
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
		} else {
			const mergedData = record?.danhSachThongTin?.map((item) => ({
				...item,
				id: null,
				ten: dsTruongBienMuc?.find((i) => i?.ma === item?.tagCode)?.noiDung,
				thuocTinhAnPham: [
					...(item?.thuocTinhAnPham || []).map((tp) => ({
						...tp,
						value: tp.value ?? null,
						ten: dsTruongBienMuc?.find((i) => i?.ma === item?.tagCode)?.thuocTinh?.find((i) => i?.code === tp?.code)
							?.tieuDe,
					})),
				],
			}));

			form.setFieldsValue({
				danhSachBienMucChiTiet: _.orderBy(mergedData, 'tagCode'),
			});
		}
	}, [visibleZ3950, dsTruongBienMuc]);

	useEffect(() => {
		if (record?._id) {
			const currentList = form.getFieldValue('danhSachBienMucChiTiet') || [];
			const currentTagCodes = currentList.map((item: any) => item.tagCode);
			const tagCodesAnPham = dsThongTinAnPham.map((item) => item.tagCode);

			const fromAnPham = dsThongTinAnPham.map((item) => ({
				...item,
				ten: item.tag?.noiDung,
				thuocTinhAnPham: item?.thuocTinhAnPham?.map((tp) => ({
					...tp,
					value: tp.value ?? null,
					ten: item?.tag?.thuocTinh?.find((i) => i?.code === tp?.code)?.tieuDe,
				})),
			}));

			const fromMauBienMuc = (mauBienMuc?.thongTinKhaiBao || [])
				.filter((item) => !tagCodesAnPham.includes(item.tag))
				.map((item) => ({
					_id: null,
					tagCode: item.tag,
					ten: item.ten,
					thuocTinhAnPham: (item?.thuocTinhDuLieu || []).map((tp) => ({
						...tp,
						value: null,
						ten: tp.ten,
					})),
				}));

			const merged = [...fromAnPham, ...fromMauBienMuc]
				.filter((item) => !currentTagCodes.includes(item.tagCode))
				.map((item) => ({
					...item,
					thuocTinhAnPham: (item.thuocTinhAnPham || []).map((tp) => ({
						...tp,
						value: null,
						ten: tp.ten,
					})),
				}));

			form.setFieldsValue({
				...record,
				danhSachBienMucChiTiet: _.orderBy([...currentList, ...merged], 'tagCode'),
			});
		}
	}, [JSON.stringify(record)]);

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
				{!record?._id ? (
					<Alert
						style={{ marginBottom: 12 }}
						type='warning'
						message='Bạn chưa thực hiện biên mục sơ lược, vui lòng biên mục sơ lược trước khi biên mục chi tiết. Đây chỉ là thông tin biên mục chi tiết từ Z39.50 chưa bao gồm thông tin của biên mục sơ lược và mẫu biên mục !'
					/>
				) : null}
				<BienMucChiTiet form={form} />

				<div className='form-footer'>
					<ButtonExtend
						disabled={!record?._id}
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
						disabled={!record?._id}
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
