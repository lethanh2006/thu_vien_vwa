import ButtonExtend from '@/components/Table/ButtonExtend';
import { ETrangThaiBienMuc } from '@/services/SachTaiLieu/constant';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Form, message, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import BienMucChiTiet from '../../components/BienMucChiTiet';
import {
	buildDetailedCatalogRows,
	mergeImportedCatalogRows,
	serializeDetailedCatalogRows,
} from '../../utils/cataloging';

const FormBienMucChiTietZ3950 = (props: any) => {
	const { getData } = props;
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, visibleZ3950, setVisibleZ3950, putBienMucChiTietModel, formSubmiting, setVisibleTimKiemZ3950 } =
		useModel('sachtailieu.anpham.anpham');
	const { danhSach: dsMauBienMuc } = useModel('danhmuc.maubienmuc'); //Lấy thông tin từ mẫu biên mục
	const {
		danhSach: dsThongTinAnPham,
		loading: loadingThongTin,
		loadedAnPhamId,
	} = useModel('sachtailieu.anpham.thongtinanpham'); //Lấy thông tin từ biên mục sơ lược
	const catalogReady = !!record?._id && !loadingThongTin && loadedAnPhamId === record._id;
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
			const savedRows = dsThongTinAnPham.filter((item) => item.anPhamId === record._id);
			const mergedRows = mergeImportedCatalogRows(savedRows, record.danhSachThongTin);
			form.setFieldsValue({
				danhSachBienMucChiTiet: buildDetailedCatalogRows(mergedRows, mauBienMuc?.thongTinKhaiBao, dsTruongBienMuc),
			});
		}
	}, [
		visibleZ3950,
		record?._id,
		record?.danhSachThongTin,
		dsThongTinAnPham,
		mauBienMuc?.thongTinKhaiBao,
		dsTruongBienMuc,
	]);

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
				setVisibleZ3950(false);
				setVisibleTimKiemZ3950(false);
			})
			.catch((er) => console.log(er));
	};

	return (
		<Spin spinning={loadingThongTin || loadingTruongBienMuc}>
			<Form onFinish={onFinish} form={form} layout='vertical' autoComplete='off'>
				<BienMucChiTiet form={form} />

				<div className='form-footer'>
					<ButtonExtend
						tooltip='Nếu lưu lại ấn phẩm sẽ ở vẫn trạng thái chờ biên mục chi tiết'
						loading={formSubmiting}
						disabled={!catalogReady}
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
						disabled={!catalogReady}
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
