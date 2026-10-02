import ExpandText from '@/components/ExpandText';
import { EOperatorType } from '@/components/Table/constant';
import ModalExpandable from '@/components/Table/ModalExpandable';
import TableStaticData from '@/components/Table/TableStaticData';
import { IColumn } from '@/components/Table/typing';
import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import { colorTrangThaiBienMuc, ETrangThaiBienMuc } from '@/services/SachTaiLieu/constant';
import { buildUpLoadFile } from '@/services/uploadFile';
import { Button, Form, message, Tag } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useIntl, useModel } from 'umi';
import { prepareBriefTitlePayload, readBriefTitle } from '../utils/cataloging';
import BienMucSoLuoc from './BienMucSoLuoc';

const FormBienMucSachTaiLieu = (props: { afterAddNew: (rec: AnPham.IRecord) => void; getData: () => void }) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const initializedRecordKey = useRef<string | null>(null);
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
		getAllModel: getAllAnPham,
		loading,
	} = useModel('sachtailieu.anpham.anpham');
	const {
		getAllModel,
		danhSach,
		loading: loadingCatalog,
		loadedAnPhamId,
	} = useModel('sachtailieu.anpham.thongtinanpham');
	const catalogReady = !record?._id || (!loadingCatalog && loadedAnPhamId === record._id);
	const { record: recDot } = useModel('sachtailieu.anpham.dotnhapsach');
	const { initialState } = useModel('@@initialState');
	const { afterAddNew, getData } = props;
	const [checkingDuplicate, setCheckingDuplicate] = useState<boolean>(false);
	const [visibleDuplicate, setVisibleDuplicate] = useState<boolean>(false);
	const [duplicateData, setDuplicateData] = useState<AnPham.IRecord[]>([]);
	const currentCatalogRows = record?._id
		? danhSach.filter((item) => !item.anPhamId || item.anPhamId === record._id)
		: [];
	const briefTitle = readBriefTitle(currentCatalogRows);

	const fullName = initialState?.currentUser?.family_name
		? `${initialState?.currentUser.family_name} ${initialState?.currentUser?.given_name ?? ''}`
		: (initialState?.currentUser?.name ?? (initialState?.currentUser?.preferred_username || ''));

	useEffect(() => {
		if (!visibleForm) {
			form.resetFields();
			initializedRecordKey.current = null;
			return;
		}
		const recordKey = record?._id ?? 'new';
		if (initializedRecordKey.current !== recordKey) {
			form.resetFields();
			initializedRecordKey.current = recordKey;
		}
		if (record?._id) {
			const fieldMapping = {
				ISBN: { tagCode: '020', subCode: '$a' },
				ISSN: { tagCode: '022', subCode: '$a' },
				tacGia: { tagCode: '100', subCode: '$a' },
				nhanDe: { tagCode: '245', subCode: '$a' },
				soThuTuCuaTap: { tagCode: '245', subCode: '$n' },
				tenTap: { tagCode: '245', subCode: '$p' },
				thongTinTrachNhiem: { tagCode: '245', subCode: '$c' },
				lanXuatBan: { tagCode: '250', subCode: '$a' },
				noiXuatBan: { tagCode: '260', subCode: '$a' },
				namXuatBan: { tagCode: '260', subCode: '$c' },
				nhaXuatBan: { tagCode: '260', subCode: '$b' },
				soTrang: { tagCode: '300', subCode: '$a' },
				dacDiemVatLy: { tagCode: '300', subCode: '$b' },
				khuonKho: { tagCode: '300', subCode: '$c' },
				tuLieuDiKem: { tagCode: '300', subCode: '$e' },
				maNgonNgu: { tagCode: '041', subCode: '$a' },
				chiSoPhanLoai: { tagCode: '082', subCode: '$a' },
			};

			const formValues: Record<string, any> = {};
			Object.entries(fieldMapping).forEach(([fieldName, { tagCode, subCode }]) => {
				const tag = currentCatalogRows.find((item) => item?.tagCode === tagCode);
				const value = tag?.thuocTinhAnPham?.find((i) => i.code === subCode)?.value;

				formValues[fieldName] = value ?? record[fieldName as keyof AnPham.IRecord] ?? '';
			});

			form.setFieldsValue({
				...record,
				...formValues,
				nhanDeSongSong: briefTitle.nhanDeSongSong,
				phuDe: briefTitle.phuDe,
			});
		}

		if (!record?._id) {
			form.setFieldsValue({
				dotNhapSachId: recDot?._id,
				canBoBienMuc: fullName,
			});
		}
	}, [record?._id, visibleForm, danhSach]);

	const getDataThen = (rec: AnPham.IRecord) => {
		setRecord({ ...record, ...rec });
		setEdit(true);
		if (afterAddNew) afterAddNew(rec);
		getAllModel(undefined, undefined, { anPhamId: rec?._id }).catch(() => undefined);
	};

	const onFinish = async (values: AnPham.IRecord) => {
		if (!catalogReady) {
			message.warning('Hãy tải lại dữ liệu biên mục trước khi lưu ấn phẩm.');
			return;
		}
		if (briefTitle.requiresDetailedCataloging) {
			message.warning('Hãy lưu ấn phẩm ở bước Biên mục chi tiết để giữ đầy đủ thông tin nhan đề.');
			return;
		}
		setFormSubmiting(true);
		const urlScanBia = await buildUpLoadFile(values, 'urlScanBia').finally(() => setFormSubmiting(false));
		values.urlScanBia = urlScanBia ?? '';
		if (edit) {
			putBienMucSoLuocModel(record?._id ?? '', prepareBriefTitlePayload(values), getData)
				.then((rec) => getDataThen(rec))
				.catch((er) => console.log(er));
		} else
			postBienMucSoLuocModel(
				{ ...prepareBriefTitlePayload(values), trangThai: ETrangThaiBienMuc.CHO_BIEN_MUC },
				getData,
			)
				.then((rec) => getDataThen(rec))
				.catch((er) => console.log(er));
	};

	const handleCheckDuplicate = async () => {
		try {
			const { tacGia, nhanDe } = form.getFieldsValue(['tacGia', 'nhanDe']);

			const tacGiaValue = tacGia?.trim();
			const nhanDeValue = nhanDe?.trim();

			if (!tacGiaValue && !nhanDeValue) {
				message.warning('Vui lòng nhập tác giả hoặc nhan đề để kiểm tra');
				return;
			}

			setCheckingDuplicate(true);

			const filters = [
				tacGiaValue && {
					active: true,
					field: 'tacGiaConverse',
					values: [tacGiaValue],
					operator: EOperatorType.INCLUDE,
				},
				nhanDeValue && {
					active: true,
					field: 'nhanDeConverse',
					values: [nhanDeValue],
					operator: EOperatorType.INCLUDE,
				},
			].filter(Boolean);

			const data = await getAllAnPham(undefined, undefined, undefined, filters, undefined, false);

			setDuplicateData(data);

			if (data.length) {
				message.warning(`Phát hiện ${data.length} ấn phẩm có dữ liệu trùng hoặc gần giống`);
				setVisibleDuplicate(true);
			} else {
				message.success('Chưa phát hiện ấn phẩm trùng hoặc gần giống');
			}
		} catch (error) {
			console.log(error);
		} finally {
			setCheckingDuplicate(false);
		}
	};

	const columns: IColumn<AnPham.IRecord>[] = [
		{
			title: 'Mã tài liệu',
			dataIndex: 'maTaiLieu',
			width: 150,
			filterType: 'string',
		},
		{
			title: 'Nhan đề',
			dataIndex: 'nhanDeConverse',
			width: 180,
			render: (val, rec) => <ExpandText>{val ?? rec?.nhanDe}</ExpandText>,
			filterType: 'string',
		},
		{
			title: 'Tác giả',
			dataIndex: 'tacGiaConverse',
			width: 150,
			render: (val, rec) => val ?? rec?.tacGia,
			filterType: 'string',
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			align: 'center',
			width: 120,
			render: (val, rec) => (
				<Tag
					style={{ whiteSpace: 'normal', wordWrap: 'break-word', textAlign: 'center' }}
					color={colorTrangThaiBienMuc[val as ETrangThaiBienMuc]}
				>
					{val}
				</Tag>
			),
			filterType: 'select',
			filterData: Object.values(ETrangThaiBienMuc),
			fixed: 'right',
		},
	];

	return (
		<>
			<Form onFinish={onFinish} form={form} layout='vertical' autoComplete='off'>
				<BienMucSoLuoc
					form={form}
					ambiguousTitle={briefTitle.ambiguousSingleValue}
					detailedTitleRequired={briefTitle.requiresDetailedCataloging}
				/>
				<div className='form-footer'>
					<Button loading={checkingDuplicate} onClick={handleCheckDuplicate}>
						Kiểm tra trùng
					</Button>
					<Button loading={formSubmiting} disabled={!catalogReady} htmlType='submit' type='primary'>
						{!edit ? 'Biên mục' : `${intl.formatMessage({ id: 'global.button.luulai' })}`}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
			<ModalExpandable
				title='Cảnh báo dữ liệu trùng hoặc gần giống'
				open={visibleDuplicate}
				onCancel={() => setVisibleDuplicate(false)}
				footer={
					<Button onClick={() => setVisibleDuplicate(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
				}
				width={900}
			>
				<TableStaticData columns={columns} data={duplicateData ?? []} loading={loading} size='small' hasTotal addStt />
			</ModalExpandable>
		</>
	);
};

export default FormBienMucSachTaiLieu;
