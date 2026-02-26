import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface SortablePhotoProps {
    id: string
    url: string
    onRemove: () => void
    isCover: boolean
}

export function SortablePhoto({ id, url, onRemove, isCover }: SortablePhotoProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        opacity: isDragging ? 0.8 : 1,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`relative group rounded-xl overflow-hidden border-2 ${isCover ? 'border-primary shadow-glow' : 'border-white/10'
                } bg-background-lighter transition-all`}
        >
            {/* Drag Handle Overlay */}
            <div
                {...attributes}
                {...listeners}
                className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"
            >
                <div className="bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-lg text-white text-xs font-semibold flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="12" r="1" /><circle cx="9" cy="5" r="1" /><circle cx="9" cy="19" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="15" cy="5" r="1" /><circle cx="15" cy="19" r="1" /></svg>
                    Arrastar
                </div>
            </div>

            <img
                src={url}
                alt="Foto do imóvel"
                className="w-full h-32 object-cover"
            />

            {isCover && (
                <div className="absolute top-2 left-2 z-20 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide">
                    Capa
                </div>
            )}

            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation()
                    onRemove()
                }}
                className="absolute top-2 right-2 z-20 bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm shadow-lg transition-colors"
                title="Remover foto"
            >
                ×
            </button>
        </div>
    )
}
