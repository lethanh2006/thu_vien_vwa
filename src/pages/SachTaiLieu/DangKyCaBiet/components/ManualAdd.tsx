import ButtonExtend from '@/components/Table/ButtonExtend';
import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import {
	getAnPhamForDKCB,
	getKhoSachForDKCB,
	getXepGiaForDKCB,
	themDangKyCaBiet,
} from '@/services/SachTaiLieu/DangKyCaBiet';
import { PlusOutlined } from '@ant-design/icons';
import { Alert, Button, Form, Input, message, Modal, Select } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { buildManualDKCBPayload, type ManualDKCBValues, validateManualDKCBNumber } from './manualEntry';

type Props = { anPham?: AnPham.IRecord; disabled?: boolean; onCreated: () => unknown };

const getErrorMessage = (error: any) =>
	error?.response?.data?.message ?? error?.response?.data?.detail?.message ?? error?.message ?? 'Vui lòng thử lại.';

export default function ManualAddDKCB({ anPham, disabled, onCreated }: Props) {
	const [form] = Form.useForm<ManualDKCBValues>();
	const [open, setOpen] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string>();
	const [loadError, setLoadError] = useState<string>();
	const [khoSach, setKhoSach] = useState<KhoSach.IRecord[]>([]);
	const [titles, setTitles] = useState<AnPham.IRecord[]>([]);
	const [lines, setLines] = useState<AnPham.IXepGia[]>([]);
	const [keyword, setKeyword] = useState('');
	const [loadingTitles, setLoadingTitles] = useState(false);
	const [loadingKho, setLoadingKho] = useState(false);
	const [loadingLines, setLoadingLines] = useState(false);
	const pending = useRef(false);
	const titleId = Form.useWatch('anPhamId', form);
	const maKhoSach = Form.useWatch('maKhoSach', form);

	useEffect(() => {
		if (!open) return undefined;
		form.resetFields();
		form.setFieldsValue({ anPhamId: anPham?._id });
		setError(undefined);
		setLoadError(undefined);
		setKeyword('');
		setLines([]);
		setLoadingKho(true);
		let cancelled = false;
		getKhoSachForDKCB()
			.then((response) => {
				if (!cancelled) setKhoSach(response.data?.data ?? []);
			})
			.catch((reason) => {
				if (!cancelled) setLoadError(`Không tải được danh sách kho: ${getErrorMessage(reason)}`);
			})
			.finally(() => {
				if (!cancelled) setLoadingKho(false);
			});
		return () => {
			cancelled = true;
		};
	}, [open, anPham?._id]);

	useEffect(() => {
		if (!open || anPham) return undefined;
		let cancelled = false;
		setLoadingTitles(true);
		const timer = window.setTimeout(() => {
			getAnPhamForDKCB(keyword.trim())
				.then((response) => {
					if (!cancelled) {
						const result: AnPham.IRecord[] = response.data?.data?.result ?? [];
						setTitles((previous) => {
							const selected = previous.find((item) => item._id === form.getFieldValue('anPhamId'));
							return selected && !result.some((item) => item._id === selected._id) ? [selected, ...result] : result;
						});
					}
				})
				.catch((reason) => {
					if (!cancelled) setLoadError(`Không tải được danh sách ấn phẩm: ${getErrorMessage(reason)}`);
				})
				.finally(() => {
					if (!cancelled) setLoadingTitles(false);
				});
		}, 300);
		return () => {
			cancelled = true;
			window.clearTimeout(timer);
		};
	}, [open, anPham?._id, keyword]);

	useEffect(() => {
		if (!open) return undefined;
		form.setFieldsValue({ thongTinXepGiaId: undefined });
		setLines([]);
		setLoadingLines(false);
		if (!titleId || !maKhoSach) return undefined;
		let cancelled = false;
		setLoadingLines(true);
		getXepGiaForDKCB(titleId, maKhoSach)
			.then((response) => {
				if (!cancelled) {
					setLines(
						(response.data?.data ?? []).filter(
							(line: AnPham.IXepGia) => line.daXepGia && line.anPhamId === titleId && line.maKhoSach === maKhoSach,
						),
					);
				}
			})
			.catch((reason) => {
				if (!cancelled) setLoadError(`Không tải được dòng xếp giá: ${getErrorMessage(reason)}`);
			})
			.finally(() => {
				if (!cancelled) setLoadingLines(false);
			});
		return () => {
			cancelled = true;
		};
	}, [open, titleId, maKhoSach]);

	const submit = async (values: ManualDKCBValues) => {
		if (pending.current) return;
		pending.current = true;
		setSubmitting(true);
		setError(undefined);
		try {
			const payload = buildManualDKCBPayload(values, khoSach, lines);
			if (anPham && payload.anPhamId !== anPham._id) throw new Error('Ấn phẩm đã thay đổi. Vui lòng mở lại form.');
			if (anPham?.online) throw new Error('Chỉ thêm ĐKCB cho ấn phẩm vật lý.');
			await themDangKyCaBiet(payload);
			message.success(`Đã thêm ĐKCB ${payload.soDangKyCaBiet}`);
			setOpen(false);
			try {
				await onCreated();
			} catch {
				message.warning('Đã thêm ĐKCB. Hãy tải lại danh sách để xem dữ liệu mới.');
			}
		} catch (reason) {
			setError(getErrorMessage(reason));
		} finally {
			pending.current = false;
			setSubmitting(false);
		}
	};

	return (
		<>
			<ButtonExtend icon={<PlusOutlined />} onClick={() => setOpen(true)} disabled={disabled || anPham?.online}>
				Thêm tay ĐKCB
			</ButtonExtend>
			<Modal
				title='Thêm tay đăng ký cá biệt'
				open={open}
				onCancel={() => !pending.current && setOpen(false)}
				maskClosable={false}
				footer={null}
				width={600}
			>
				<Form form={form} layout='vertical' onFinish={submit} disabled={submitting} autoComplete='off'>
					{loadError ? <Alert type='warning' message={loadError} showIcon style={{ marginBottom: 12 }} /> : null}
					{error ? <Alert type='error' message={error} showIcon style={{ marginBottom: 12 }} /> : null}
					<Form.Item name='anPhamId' label='Ấn phẩm' rules={[{ required: true, message: 'Chọn ấn phẩm.' }]}>
						<Select
							disabled={!!anPham}
							showSearch
							filterOption={false}
							onSearch={setKeyword}
							loading={loadingTitles}
							options={(anPham ? [anPham] : titles).map((item) => ({
								value: item._id,
								label: [item.nhanDe, item.maTaiLieu].filter(Boolean).join(' — '),
							}))}
							placeholder='Tìm theo nhan đề và chọn ấn phẩm vật lý'
						/>
					</Form.Item>
					<Form.Item name='maKhoSach' label='Kho sách' rules={[{ required: true, message: 'Chọn kho sách.' }]}>
						<Select
							showSearch
							optionFilterProp='label'
							loading={loadingKho}
							options={khoSach.map((kho) => ({ value: kho.ma, label: `${kho.ten} (${kho.ma})` }))}
							placeholder='Chọn kho có mã trùng tiền tố ĐKCB'
						/>
					</Form.Item>
					<Form.Item
						name='thongTinXepGiaId'
						label='Dòng xếp giá (không bắt buộc)'
						extra='Chỉ hiển thị dòng đã xếp giá của ấn phẩm và kho đã chọn.'
					>
						<Select
							allowClear
							loading={loadingLines}
							disabled={!titleId || !maKhoSach || loadingLines}
							options={lines.map((line) => ({
								value: line._id,
								label: `${line.dotNhapSach?.ten ?? 'Xếp giá'} — ${line.soLuong} bản — ${line.donGia == null ? 'Chưa có giá' : `${line.donGia} VNĐ`}`,
							}))}
							placeholder='Có thể để trống nếu không gắn dòng xếp giá'
						/>
					</Form.Item>
					<Form.Item
						name='soDangKyCaBiet'
						label='Số đăng ký cá biệt'
						dependencies={['maKhoSach']}
						extra={`Dạng ${maKhoSach?.toUpperCase() ?? 'MÃ KHO'}/00001; tối thiểu 5 chữ số, không thừa số 0 đứng đầu.`}
						rules={[
							{ required: true, message: 'Nhập số đăng ký cá biệt.' },
							() => ({
								validator: (_, value) => {
									if (!value) return Promise.resolve();
									const numberError = validateManualDKCBNumber(value, form.getFieldValue('maKhoSach'));
									return numberError ? Promise.reject(new Error(numberError)) : Promise.resolve();
								},
							}),
						]}
					>
						<Input placeholder={`${maKhoSach?.toUpperCase() ?? 'KHO1'}/00001`} autoComplete='off' />
					</Form.Item>
					<div className='form-footer'>
						<Button htmlType='submit' type='primary' loading={submitting} disabled={loadingKho || loadingLines}>
							Thêm ĐKCB
						</Button>
						<Button onClick={() => setOpen(false)} disabled={submitting}>
							Hủy
						</Button>
					</div>
				</Form>
			</Modal>
		</>
	);
}
