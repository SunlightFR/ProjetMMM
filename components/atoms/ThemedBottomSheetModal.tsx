import {useTheme} from "@/hooks/useThemeColor";
import {BottomSheetModal} from "@gorhom/bottom-sheet";
import {forwardRef} from "react";

export const ThemedBottomSheetModal = forwardRef((props, ref)=>{
    const {colors} = useTheme()

    return <BottomSheetModal
        ref={ref}
        backgroundStyle={{
            backgroundColor:colors.background,
            borderColor:colors.border,
            borderWidth:2,
            borderStyle:"solid"
        }}
        handleIndicatorStyle={{backgroundColor:colors.border}}

        {...props}

    >
        {props.children}
    </BottomSheetModal>
})