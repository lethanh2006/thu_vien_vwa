import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import { ETrangThaiDangKyCaBiet, nameTrangThaiDangKyCaBiet } from '@/services/SachTaiLieu/constant';
import { inputFormat } from '@/utils/utils';
import { Tabs } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import StatDanhSachDKCB from '../../DangKyCaBiet/components/Stat';

const DanhSachDKCB = () => {
	const { record: recAnPham } = useModel('sachtailieu.anpham.anpham');
	const { getModel, page, limit } = useModel('sachtailieu.anpham.anphamxepgia');
	const [trangThai, setTrangThai] = useState<string>('ALL');

	const getData = () => {
		if (recAnPham?._id) {
			if (trangThai === 'ALL') getModel({ anPhamId: recAnPham?._id }, undefined, { soDangKyCaBiet: 1 });
			else getModel({ anPhamId: recAnPham?._id, trangThai: trangThai as any }, undefined, { soDangKyCaBiet: 1 });
		}
	};

	const columns: IColumn<AnPham.IAnPhamXepGia>[] = [
		{
			title: 'Nhan đề',
			width: 180,
			render: (val, rec) => <ExpandText>{recAnPham?.nhanDe}</ExpandText>,
		},
		{
			title: 'Tác giả',
			width: 150,
			render: (val, rec) => recAnPham?.tacGia,
		},

		{
			title: 'ĐKCB',
			dataIndex: 'soDangKyCaBiet',
			align: 'center',
			width: 120,
			sortable: true,
			filterType: 'string',
		},
		{
			title: 'Đơn giá',
			width: 120,
			align: 'right',
			render: (val, rec) => `${inputFormat(rec?.thongTinXepGia?.donGia ?? 0)} VNĐ`,
		},
	];

	return (
		<>
			<StatDanhSachDKCB
				condition={{
					anPhamId: recAnPham?._id,
				}}
			/>

			<Tabs activeKey={trangThai} onChange={(tab) => setTrangThai(tab)}>
				<Tabs.TabPane key='ALL' tab='Tất cả' />
				{Object.values(ETrangThaiDangKyCaBiet).map((tab) => (
					<Tabs.TabPane key={tab} tab={nameTrangThaiDangKyCaBiet[tab]} />
				))}
			</Tabs>

			<TableBase
				getData={getData}
				columns={columns}
				dependencies={[page, limit, recAnPham?._id, trangThai]}
				modelName='sachtailieu.anpham.anphamxepgia'
				buttons={{ create: false }}
				hideCard
			/>
		</>
	);
};

export default DanhSachDKCB;
