import ExpandText from '@/components/ExpandText';
import { EOperatorType } from '@/components/Table/constant';
import ModalExpandable from '@/components/Table/ModalExpandable';
import TableStaticData from '@/components/Table/TableStaticData';
import { IColumn } from '@/components/Table/typing';
import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import { colorTrangThaiBienMuc, ETrangThaiBienMuc } from '@/services/SachTaiLieu/constant';
import { buildUpLoadFile } from '@/services/uploadFile';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Form, message, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import BienMucSoLuoc from './BienMucSoLuoc';

const FormBienMucSachTaiLieu = (props: { afterAddNew: (rec: AnPham.IRecord) => void; getData: () => void }) => {
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
		getAllModel: getAllAnPham,
		loading,
	} = useModel('sachtailieu.anpham.anpham');
	const { getAllModel, danhSach } = useModel('sachtailieu.anpham.thongtinanpham');
	const { record: recDot } = useModel('sachtailieu.anpham.dotnhapsach');
	const { initialState } = useModel('@@initialState');
	const { afterAddNew, getData } = props;
	const [checkingDuplicate, setCheckingDuplicate] = useState<boolean>(false);
	const [visibleDuplicate, setVisibleDuplicate] = useState<boolean>(false);
	const [duplicateData, setDuplicateData] = useState<AnPham.IRecord[]>([]);

	const fullName = initialState?.currentUser?.family_name
		? `${initialState?.currentUser.family_name} ${initialState?.currentUser?.given_name ?? ''}`
		: (initialState?.currentUser?.name ?? (initialState?.currentUser?.preferred_username || ''));

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
		} else if (record?._id) {
			const fieldMapping = {
				ISBN: { tagCode: '020', subCode: '$a' },
				ISSN: { tagCode: '022', subCode: '$a' },
				tacGia: { tagCode: '100', subCode: '$a' },
				nhanDe: { tagCode: '245', subCode: '$a' },
				soThuTuCuaTap: { tagCode: '245', subCode: '$n' },
				tenTap: { tagCode: '245', subCode: '$p' },
				nhanDeSongSong: { tagCode: '245', subCode: '$b' },
				phuDe: { tagCode: '245', subCode: '$b' },
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
				const tag = danhSach?.find((item) => item?.tagCode === tagCode);
				const value = tag?.thuocTinhAnPham?.find((i) => i.code === subCode)?.value;

				if (value) {
					formValues[fieldName] = value;
				}
			});

			form.setFieldsValue({
				...record,
				...formValues,
			});
		}

		if (!record?._id) {
			form.setFieldsValue({
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
		if (edit) {
			putBienMucSoLuocModel(record?._id ?? '', values, getData)
				.then((rec) => getDataThen(rec))
				.catch((er) => console.log(er));
		} else
			postBienMucSoLuocModel({ ...values, trangThai: ETrangThaiBienMuc.CHO_BIEN_MUC }, getData)
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
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<BienMucSoLuoc form={form} />
				<div className='form-footer'>
					<Button loading={checkingDuplicate} onClick={handleCheckDuplicate}>
						Kiểm tra trùng
					</Button>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
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
