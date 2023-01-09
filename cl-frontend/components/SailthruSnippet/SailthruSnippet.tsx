export function SailthruSnippet() {
    return (
        <>
            {/* eslint-disable-next-line @next/next/no-sync-scripts */}
            <script src="https://ak.sail-horizon.com/spm/spm.v1.min.js"></script>
            <script
                type="text/javascript"
                dangerouslySetInnerHTML={{
                    __html: `Sailthru.init({ customerId: '${process.env.NEXT_PUBLIC_SAILTHRU_CUSTOMER_ID}' });`,
                }}
            />
        </>
    );
}
