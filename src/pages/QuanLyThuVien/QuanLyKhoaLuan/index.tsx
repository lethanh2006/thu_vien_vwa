import { ELoaiDotQuanLyThuvien } from '@/services/QuanLyThuVien/constants';
import QuanLyThuVienPage from '..';

const KhoaLuanPage = () => {
	return <QuanLyThuVienPage loai={ELoaiDotQuanLyThuvien.KHOA_LUAN} />;
};

export default KhoaLuanPage;
