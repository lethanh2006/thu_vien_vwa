import { getDkcbPreview } from '@/services/SachTaiLieu/AnPham';
import { useEffect, useState } from 'react';

const useDkcbPreview = (maKhoSach?: string, active = true) => {
	const [preview, setPreview] = useState<{
		maKhoSach: string;
		value?: string;
		loading: boolean;
		failed?: boolean;
	}>();

	useEffect(() => {
		let cancelled = false;
		if (!active || !maKhoSach) {
			setPreview(undefined);
			return;
		}

		setPreview({ maKhoSach, loading: true });
		getDkcbPreview(maKhoSach)
			.then((res) => {
				if (!cancelled) {
					setPreview({ maKhoSach, value: res.data.data.soDangKyCaBietTiepTheo, loading: false });
				}
			})
			.catch(() => {
				if (!cancelled) setPreview({ maKhoSach, loading: false, failed: true });
			});

		return () => {
			cancelled = true;
		};
	}, [maKhoSach, active]);

	if (!active || !maKhoSach) return { value: undefined, loading: false, failed: false };
	if (preview?.maKhoSach !== maKhoSach) return { value: undefined, loading: true, failed: false };
	return { value: preview.value, loading: preview.loading, failed: !!preview.failed };
};

export default useDkcbPreview;
