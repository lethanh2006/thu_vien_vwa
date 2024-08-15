import { ELoaiDotQuanLyThuvien } from '@/services/QuanLyThuVien/constants';
import QuanLyThuVienPage from '..';

const QuanLyLuanVan = () => {
	return <QuanLyThuVienPage loai={ELoaiDotQuanLyThuvien.LUAN_VAN} />;
};

export default QuanLyLuanVan;
