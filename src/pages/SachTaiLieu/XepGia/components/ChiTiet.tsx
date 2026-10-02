import { EOperatorType } from '@/components/Table/constant';
import type { IColumn } from '@/components/Table/typing';
import useInitService from '@/hooks/useInitService';
import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import dayjs from '@/utils/dayjs';
import { inputFormat } from '@/utils/utils';
import { Alert, Input, Modal, Table } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const ChiTietXepGia = (props: { visible: boolean; setVisible: (val: boolean) => void }) => {
	const { visible, setVisible } = props;
	const { record: recXepGia } = useModel('sachtailieu.anpham.xepgia');
	const { getService } = useInitService('an-pham-xep-gia');
	const [rows, setRows] = useState<AnPham.IAnPhamXepGia[]>([]);
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [total, setTotal] = useState(0);
	const [loading, setLoading] = useState(false);
	const [keyword, setKeyword] = useState('');
	const [error, setError] = useState<string>();

	useEffect(() => {
		setPage(1);
		setKeyword('');
		setRows([]);
		setTotal(0);
	}, [visible, recXepGia?._id]);

	useEffect(() => {
		if (!visible || !recXepGia?._id) return undefined;
		let cancelled = false;
		setLoading(true);
		setError(undefined);
		getService(
			{
				page,
				limit,
				condition: { thongTinXepGiaId: recXepGia._id },
				filters: keyword ? [{ field: 'soDangKyCaBiet', values: [keyword], operator: EOperatorType.CONTAIN }] : [],
				sort: { soDangKyCaBiet: 1 },
			} as any,
			'page',
		)
			.then((res) => {
				if (cancelled) return;
				setRows(res.data?.data?.result ?? []);
				setTotal(res.data?.data?.total ?? 0);
			})
			.catch((reason) => {
				if (!cancelled) {
					setRows([]);
					setTotal(0);
					setError(reason?.response?.data?.message ?? 'Không tải được danh sách ĐKCB.');
				}
			})
			.finally(() => {
				if (!cancelled) setLoading(false);
			});
		return () => {
			cancelled = true;
		};
	}, [visible, recXepGia?._id, page, limit, keyword]);

	const columns: IColumn<AnPham.IAnPhamXepGia>[] = [
		{
			title: 'ĐKCB',
			dataIndex: 'soDangKyCaBiet',
			align: 'center',
			width: 120,
		},
		{
			title: 'Thời gian xếp giá',
			dataIndex: 'thoiGianXepGia',
			align: 'center',
			width: 130,
			render: (val, rec) => val && dayjs(val).format('DD/MM/YYYY'),
		},
		{
			title: 'Đơn giá',
			width: 120,
			align: 'right',
			render: (val, rec) => `${inputFormat(recXepGia?.donGia ?? 0)} VNĐ`,
		},
	];

	return (
		<Modal title='Chi tiết xếp giá' open={visible} onCancel={() => setVisible(false)} width={800} footer={null}>
			<Input.Search
				key={`${visible}-${recXepGia?._id}`}
				placeholder='Tìm số ĐKCB'
				allowClear
				onSearch={(value) => {
					setPage(1);
					setKeyword(value.trim());
				}}
				style={{ marginBottom: 12 }}
			/>
			{error && <Alert type='error' showIcon message={error} style={{ marginBottom: 12 }} />}
			<Table
				rowKey='_id'
				dataSource={rows}
				loading={loading}
				columns={columns}
				pagination={{
					current: page,
					pageSize: limit,
					total,
					showSizeChanger: true,
					onChange: (nextPage, nextLimit) => {
						setPage(nextPage);
						setLimit(nextLimit);
					},
				}}
			/>
		</Modal>
	);
};

export default ChiTietXepGia;
