import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import type { IColumn } from '@/components/Table/typing';
import type { SinhVien } from '@/services/SinhVien/typings';
import type { ToChucNhanSu } from '@/services/ToChucNhanSu/typing';
import dayjs from '@/utils/dayjs';
import { CheckOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import { useIntl, useModel } from 'umi';

const ModalNguoiMuon = (props: {
	visible: boolean;
	setVisible: (val: boolean) => void;
	activeKey: 'sinh-vien' | 'can-bo';
}) => {
	const intl = useIntl();
	const { visible, setVisible, activeKey } = props;
	const { getModel, page, limit } = useModel('sachtailieu.muontra.danhsachbandoc');
	const { setRecord: setRecSinhVien } = useModel('sinhvien.sinhvien');
	const { setRecord: setRecCanBo } = useModel('tochucnhansu.nhansu');

	const getData = () => {
		getModel(undefined, undefined, undefined, undefined, undefined, `thong-ke/${activeKey}`);
	};

	const columns: IColumn<SinhVien.IRecord & ToChucNhanSu.INhanSu>[] = [
		{
			title: 'Mã SV',
			dataIndex: 'ma',
			align: 'center',
			width: 120,
			filterType: 'string',
			hide: activeKey !== 'sinh-vien',
		},
		{
			title: 'Họ tên',
			dataIndex: 'ten',
			width: 150,
			filterType: 'string',
			hide: activeKey !== 'sinh-vien',
		},
		{
			title: 'Ngày sinh',
			dataIndex: 'ngaySinh',
			width: 100,
			align: 'center',
			filterType: 'date',
			sortable: true,
			render: (val) => val && dayjs(val).format('DD/MM/YYYY'),
			hide: activeKey !== 'sinh-vien',
		},
		{
			title: 'Khóa ngành',
			dataIndex: 'maKhoaNganh',
			width: 180,
			render: (val, rec) => rec.khoaNganh?.ten ?? val,
			hide: activeKey !== 'sinh-vien',
		},
		{
			title: 'Mã cán bộ',
			dataIndex: 'maCanBo',
			align: 'center',
			width: 120,
			filterType: 'string',
			hide: activeKey !== 'can-bo',
		},
		{
			title: 'Họ đệm',
			dataIndex: 'hoDem',
			width: 120,
			filterType: 'string',
			hide: activeKey !== 'can-bo',
		},
		{
			title: 'Tên',
			dataIndex: 'ten',
			width: 90,
			filterType: 'string',
			hide: activeKey !== 'can-bo',
		},
		{
			title: 'Đơn vị',
			dataIndex: 'donViChinhId' as any,
			width: 150,
			render: (val, rec) => rec?.donViChinh?.ten,
			hide: activeKey !== 'can-bo',
		},
		{
			title: 'SL chờ xử lý',
			align: 'center',
			render: (val, rec) => rec?.thongKe?.choXuLy,
			width: 80,
		},
		{
			title: 'SL đang thuê mượn',
			align: 'center',
			render: (val, rec) => rec?.thongKe?.dangThueMuon,
			width: 80,
		},
		{
			title: 'SL đã trả',
			align: 'center',
			render: (val, rec) => rec?.thongKe?.daTra,
			width: 80,
		},
		{
			title: 'SL quá hạn',
			align: 'center',
			render: (val, rec) => rec?.thongKe?.quaHan,
			width: 80,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (val, rec) => (
				<ButtonExtend
					onClick={() => {
						// eslint-disable-next-line @typescript-eslint/no-unused-expressions
						activeKey === 'sinh-vien' ? setRecSinhVien(rec) : setRecCanBo(rec);
						setVisible(false);
					}}
					tooltip='Xác nhận'
					className='text-success'
					type='link'
					icon={<CheckOutlined />}
				/>
			),
		},
	];

	return (
		<Modal title='Tìm kiếm' open={visible} onCancel={() => setVisible(false)} footer={null} width={900}>
			<TableBase
				getData={getData}
				columns={columns}
				dependencies={[page, limit, activeKey]}
				modelName='sachtailieu.muontra.danhsachbandoc'
				widthDrawer={1100}
				title='Danh sách bạn đọc'
				buttons={{ create: false }}
				hideCard
			/>

			<div className='form-footer'>
				<Button onClick={() => setVisible(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
			</div>
		</Modal>
	);
};

export default ModalNguoiMuon;
