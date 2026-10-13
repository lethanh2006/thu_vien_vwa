import type { IColumn } from '@/components/Table/typing';
import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import { ETagMarc, ETruongConMarc } from '@/services/SachTaiLieu/constant';
import { inputFormat } from '@/utils/utils';
import { Typography } from 'antd';
import _ from 'lodash';
import { useIntl } from 'umi';
import { getGiaTriMarc } from '../utils';

/**
 * Population khi lấy danh sách ấn phẩm: các danh mục màn chi tiết (ChiTietBienMuc) đọc từ record,
 * các tag MARC và bản ĐKCB cần cho cột thông tin
 */
export const populationAnPham = [
	{ path: 'dotNhapSach' },
	{ path: 'kieuBanGhi' },
	{ path: 'dangTaiLieu' },
	{ path: 'capThuMuc' },
	{ path: 'vatMangTin' },
	{ path: 'mauBienMuc' },
	{ path: 'danhSachThongTin', condition: { tagCode: { $in: Object.values(ETagMarc) } } },
	{ path: 'danhSachAnPhamVatLy', population: [{ path: 'thongTinXepGia' }] },
];

/** Nhan đề phân tầng: nhan đề và tập liền mạch trên dòng đầu, các giá trị 245$b (nhan đề song song, phụ đề) ở dòng dưới */
export const NhanDeAnPham = (props: { record: AnPham.IRecord }) => {
	const { danhSachThongTin, nhanDe } = props.record;
	const nhanDeVaTap = [
		nhanDe,
		...getGiaTriMarc(danhSachThongTin, ETagMarc.NHAN_DE, ETruongConMarc.N),
		...getGiaTriMarc(danhSachThongTin, ETagMarc.NHAN_DE, ETruongConMarc.P),
	].join(' ');
	const danhSachGiaTri245b = getGiaTriMarc(danhSachThongTin, ETagMarc.NHAN_DE, ETruongConMarc.B);

	return (
		<>
			<div>{nhanDeVaTap}</div>
			{danhSachGiaTri245b.length ? (
				<Typography.Text type='secondary'>{danhSachGiaTri245b.join('; ')}</Typography.Text>
			) : null}
		</>
	);
};

/** Các cột ĐKCB, xuất bản, phân loại, chủ đề, từ khóa, giá tiền dùng chung cho danh sách Biên mục và Xếp giá */
const useColumnsThongTinAnPham = (onClickDKCB: (rec: AnPham.IRecord) => void): IColumn<AnPham.IRecord>[] => {
	const intl = useIntl();

	return [
		{
			title: intl.formatMessage({ id: 'sachtailieu.anpham.dangKyCaBiet' }),
			key: 'dangKyCaBiet',
			width: 200,
			// Thu gọn trên 1 dòng, bấm vào mới mở danh sách ĐKCB
			render: (val, rec) => {
				const danhSachSoDKCB = (rec.danhSachAnPhamVatLy ?? []).map((banSach) => banSach.soDangKyCaBiet);
				let tomTatDKCB = intl.formatMessage({ id: 'sachtailieu.anpham.chuaCoDKCB' });
				if (danhSachSoDKCB.length === 1) tomTatDKCB = danhSachSoDKCB[0];
				if (danhSachSoDKCB.length > 1) {
					const soBanKhac = intl.formatMessage(
						{ id: 'sachtailieu.anpham.soBanKhac' },
						{ soLuong: danhSachSoDKCB.length - 1 },
					);
					tomTatDKCB = `${danhSachSoDKCB[0]}${soBanKhac}`;
				}
				return <a onClick={() => onClickDKCB(rec)}>{tomTatDKCB}</a>;
			},
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.anpham.noiXuatBan' }),
			key: 'noiXuatBan',
			width: 140,
			render: (val, rec) => getGiaTriMarc(rec.danhSachThongTin, ETagMarc.XUAT_BAN, ETruongConMarc.A).join('; '),
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.anpham.namXuatBan' }),
			key: 'namXuatBan',
			width: 100,
			render: (val, rec) => getGiaTriMarc(rec.danhSachThongTin, ETagMarc.XUAT_BAN, ETruongConMarc.C).join('; '),
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.anpham.nhaXuatBan' }),
			key: 'nhaXuatBan',
			width: 170,
			render: (val, rec) => getGiaTriMarc(rec.danhSachThongTin, ETagMarc.XUAT_BAN, ETruongConMarc.B).join('; '),
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.anpham.kyHieuPhanLoai' }),
			key: 'kyHieuPhanLoai',
			width: 120,
			// Nhãn gáy, mẫu số ĐKCB đọc 090; biên mục sơ lược ghi 082
			render: (val, rec) =>
				getGiaTriMarc(rec.danhSachThongTin, ETagMarc.KY_HIEU_XEP_GIA, ETruongConMarc.A)[0] ??
				getGiaTriMarc(rec.danhSachThongTin, ETagMarc.PHAN_LOAI_DDC, ETruongConMarc.A)[0],
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.anpham.chuDe' }),
			key: 'chuDe',
			width: 200,
			render: (val, rec) => getGiaTriMarc(rec.danhSachThongTin, ETagMarc.CHU_DE, ETruongConMarc.A).join('; '),
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.anpham.tuKhoa' }),
			key: 'tuKhoa',
			width: 180,
			render: (val, rec) => getGiaTriMarc(rec.danhSachThongTin, ETagMarc.TU_KHOA, ETruongConMarc.A).join('; '),
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.anpham.giaTien' }),
			key: 'giaTien',
			width: 160,
			align: 'right',
			// Giá tiền lấy theo đơn giá dòng xếp giá của từng bản; bản chưa có đơn giá thì bỏ qua
			render: (val, rec) => {
				const danhSachDonGia = (rec.danhSachAnPhamVatLy ?? [])
					.map((banSach) => banSach.thongTinXepGia?.donGia)
					.filter((donGia): donGia is number => !_.isNil(donGia));
				if (!danhSachDonGia.length) return null;
				const giaThapNhat = _.min(danhSachDonGia);
				const giaCaoNhat = _.max(danhSachDonGia);
				return giaThapNhat === giaCaoNhat
					? `${inputFormat(giaThapNhat)} VNĐ`
					: `${inputFormat(giaThapNhat)} – ${inputFormat(giaCaoNhat)} VNĐ`;
			},
		},
	];
};

export default useColumnsThongTinAnPham;
