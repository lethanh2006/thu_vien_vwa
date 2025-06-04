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
	const { getAllModel, danhSach } = useModel('sachtailieu.anpham.thongtinanpham');
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
			};

			const formValues: Record<string, any> = {};
			Object.entries(fieldMapping).forEach(([fieldName, { tagCode, subCode }]) => {
				const tag = danhSach?.find((item) => item?.tagCode === tagCode);
				let value = tag?.thuocTinhAnPham?.find((i) => i.code === subCode)?.value;

				// Gán giá trị mặc định từ `record` nếu không tìm thấy giá trị từ `tag`
				if (!value && (fieldName === 'tacGia' || fieldName === 'nhanDe')) {
					value = record?.[fieldName];
				}

				if (value) {
					formValues[fieldName] = value;
				}
			});

			// Gán giá trị cho form
			form.setFieldsValue({
				...record,
				...formValues,
			});
		} else {
			form.setFieldsValue({
				online: tabActive === '1' ? false : true,
				dotNhapSachId: recDot?._id,
				canBoBienMuc: fullName,
			});
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: AnPham.IRecord) => {
		setFormSubmiting(true);
		const urlScanBia = await buildUpLoadFile(values, 'urlScanBia').finally(() => setFormSubmiting(false));
		values.urlScanBia = urlScanBia ?? '';
		values.namXuatBan = Number(values.namXuatBan);
		if (edit) {
			putBienMucSoLuocModel(record?._id ?? '', values, getData)
				.then((rec) => setVisibleForm(false))
				.catch((er) => console.log(er));
		} else
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
