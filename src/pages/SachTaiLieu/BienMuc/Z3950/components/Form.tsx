import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import { ETrangThaiBienMuc } from '@/services/SachTaiLieu/constant';
import { buildUpLoadFile } from '@/services/uploadFile';
import { Button, Form, message } from 'antd';
import { useEffect, useRef } from 'react';
import { useIntl, useModel } from 'umi';
import BienMucSoLuoc from '../../components/BienMucSoLuoc';
import { applyBriefTitleToRows, prepareBriefTitlePayload, readBriefTitle } from '../../utils/cataloging';

const FormZ3950 = (props: { afterAddNew: (rec: AnPham.IRecord) => void; getData: () => void }) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const initializedSource = useRef<{ id?: string; rows?: AnPham.IThongTinAnPham[] } | null>(null);
	const {
		record,
		setVisibleZ3950,
		edit,
		postBienMucSoLuocModel,
		putBienMucSoLuocModel,
		formSubmiting,
		setRecord,
		setEdit,
		setFormSubmiting,
		visibleZ3950,
	} = useModel('sachtailieu.anpham.anpham');
	const { getAllModel, loading: loadingCatalog, loadedAnPhamId } = useModel('sachtailieu.anpham.thongtinanpham');
	const catalogReady = !record?._id || (!loadingCatalog && loadedAnPhamId === record._id);
	const { record: recDot } = useModel('sachtailieu.anpham.dotnhapsach');
	const { initialState } = useModel('@@initialState');
	const { afterAddNew, getData } = props;
	const briefTitle = readBriefTitle(record?.danhSachThongTin);

	const fullName = initialState?.currentUser?.family_name
		? `${initialState?.currentUser.family_name} ${initialState?.currentUser?.given_name ?? ''}`
		: (initialState?.currentUser?.name ?? (initialState?.currentUser?.preferred_username || ''));

	useEffect(() => {
		if (!visibleZ3950) {
			form.resetFields();
			initializedSource.current = null;
		} else {
			if (
				!initializedSource.current ||
				initializedSource.current.id !== record?._id ||
				initializedSource.current.rows !== record?.danhSachThongTin
			) {
				form.resetFields();
				initializedSource.current = { id: record?._id, rows: record?.danhSachThongTin };
			}
			form.setFieldsValue({
				...record,
				nhanDeSongSong: briefTitle.nhanDeSongSong,
				phuDe: briefTitle.phuDe,
				dotNhapSachId: recDot?._id,
				canBoBienMuc: fullName,
			});
		}
	}, [record?._id, record?.danhSachThongTin, visibleZ3950]);

	const getDataThen = (rec: AnPham.IRecord, importedRows: AnPham.IThongTinAnPham[]) => {
		setRecord({ ...record, ...rec, danhSachThongTin: importedRows });
		setEdit(true);
		if (afterAddNew) afterAddNew(rec);
		getAllModel(undefined, undefined, { anPhamId: rec?._id }).catch(() => undefined);
	};

	const onFinish = async (values: AnPham.IRecord) => {
		if (!catalogReady) {
			message.warning('Hãy tải lại dữ liệu biên mục trước khi lưu ấn phẩm.');
			return;
		}
		if (record?._id && briefTitle.requiresDetailedCataloging) {
			message.warning('Hãy lưu ấn phẩm ở bước Biên mục chi tiết để giữ đầy đủ thông tin nhan đề.');
			return;
		}
		const importedRows = briefTitle.requiresDetailedCataloging
			? (record?.danhSachThongTin ?? [])
			: applyBriefTitleToRows(record?.danhSachThongTin, values);
		setFormSubmiting(true);
		const urlScanBia = await buildUpLoadFile(values, 'urlScanBia').finally(() => setFormSubmiting(false));
		values.urlScanBia = urlScanBia ?? '';
		if (edit && record?._id) {
			putBienMucSoLuocModel(record?._id ?? '', prepareBriefTitlePayload(values), getData)
				.then((rec) => getDataThen(rec, importedRows))
				.catch((er) => console.log(er));
		} else
			postBienMucSoLuocModel(
				{
					...prepareBriefTitlePayload(values, briefTitle.requiresDetailedCataloging),
					trangThai: ETrangThaiBienMuc.CHO_BIEN_MUC,
				},
				getData,
			)
				.then((rec) => getDataThen(rec, importedRows))
				.catch((er) => console.log(er));
	};

	return (
		<Form onFinish={onFinish} form={form} layout='vertical' autoComplete='off'>
			<BienMucSoLuoc
				form={form}
				ambiguousTitle={briefTitle.ambiguousSingleValue}
				detailedTitleRequired={briefTitle.requiresDetailedCataloging}
			/>
			<div className='form-footer'>
				<Button loading={formSubmiting} disabled={!catalogReady} htmlType='submit' type='primary'>
					Biên mục
				</Button>
				<Button onClick={() => setVisibleZ3950(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
			</div>
		</Form>
	);
};

export default FormZ3950;
