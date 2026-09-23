import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  FileText,
  Save,
  Check,
  X,
  Undo,
  Redo,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Highlighter,
  Palette,
  Minus,
  Plus,
  Image as ImageIcon,
  FolderOpen,
  Eye,
  EyeOff,
  Settings,
  AlertTriangle,
  Calendar,
  Clock,
  User,
  Tag,
  Share2,
  Printer,
  ChevronDown,
  Sparkles,
  MoveVertical,
} from 'lucide-react';
import { Article, Category, ArticleSection } from '../../types';
import { CATEGORIES } from '../../data/articles';
import { MediaLibrary } from './MediaLibrary';

interface GoogleDocsArticleEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (article: Article) => void;
  articleToEdit?: Article | null;
  categories?: { label: string; value: string }[];
}

const DEFAULT_AVATARS = [
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
];

const SUGGESTED_HERO_IMAGES = [
  { label: 'Océans & Mines', url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1600&q=85' },
  { label: 'Data Center & IA', url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=85' },
  { label: 'Parlement & Finance', url: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1600&q=85' },
  { label: 'Santé & Labo', url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1600&q=85' },
  { label: 'Forêt & Écologie', url: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1600&q=85' },
];

const TEXT_COLORS = [
  { label: 'Noir texte', value: '#1a1a1a' },
  { label: 'Encre sombre', value: '#2b1812' },
  { label: 'Brun Six%', value: '#3f241c' },
  { label: 'Vert Six%', value: '#839b64' },
  { label: 'Rouge alerte', value: '#dc2626' },
  { label: 'Bleu cobalt', value: '#2563eb' },
  { label: 'Gris ardoise', value: '#4b5563' },
  { label: 'Orange vif', value: '#ea580c' },
];

const HIGHLIGHT_COLORS = [
  { label: 'Aucun', value: 'transparent' },
  { label: 'Jaune fluo', value: '#fef08a' },
  { label: 'Vert d\'eau', value: '#bbf7d0' },
  { label: 'Olive Six%', value: 'rgba(131, 155, 100, 0.35)' },
  { label: 'Bleu ciel', value: '#bae6fd' },
  { label: 'Pêche doux', value: '#fed7aa' },
  { label: 'Rose pastel', value: '#fbcfe8' },
  { label: 'Lavande', value: '#e9d5ff' },
];

const FONT_SIZES = [10, 11, 12, 13, 14, 15, 16, 18, 20, 22, 24, 28, 32, 36, 42, 48];

const LINE_HEIGHTS = [
  { label: '1.0 — Simple', value: '1.0' },
  { label: '1.15 — Étroit', value: '1.15' },
  { label: '1.35 — Compact', value: '1.35' },
  { label: '1.6 — Standard', value: '1.6' },
  { label: '1.85 — Aéré', value: '1.85' },
  { label: '2.0 — Double', value: '2.0' },
];

export const GoogleDocsArticleEditor: React.FC<GoogleDocsArticleEditorProps> = ({
  isOpen,
  onClose,
  onSave,
  articleToEdit,
  categories = CATEGORIES,
}) => {
  // Editorial Metadata
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [chapeau, setChapeau] = useState('');
  const [category, setCategory] = useState<Category>('Environnement');
  const [categoryTag, setCategoryTag] = useState('Dossier Spécial');
  const [authorName, setAuthorName] = useState('Aprilia Narducci');
  const [authorRole, setAuthorRole] = useState('Grand reporter & data-investigatrice');
  const [authorAvatar, setAuthorAvatar] = useState(DEFAULT_AVATARS[0]);
  const [publishedAt, setPublishedAt] = useState('');
  const [readTimeMinutes, setReadTimeMinutes] = useState(8);
  const [heroImage, setHeroImage] = useState(SUGGESTED_HERO_IMAGES[0].url);
  const [heroImageCaption, setHeroImageCaption] = useState('Photographie exclusive Six%');
  const [heroImageCredits, setHeroImageCredits] = useState('Archives Six%');
  const [isPopular, setIsPopular] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [keyRevelations, setKeyRevelations] = useState<string[]>([]);
  const [newRevelation, setNewRevelation] = useState('');

  // UI Modes & Drawers
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const [showMetadataDrawer, setShowMetadataDrawer] = useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState<'hero' | 'author' | 'inline'>('hero');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showHeadingsMenu, setShowHeadingsMenu] = useState(false);
  const [showAlignMenu, setShowAlignMenu] = useState(false);
  const [showFontSizeMenu, setShowFontSizeMenu] = useState(false);
  const [showLineHeightMenu, setShowLineHeightMenu] = useState(false);

  // Formatting state
  const [currentFontSize, setCurrentFontSize] = useState<number>(16);
  const [currentLineHeight, setCurrentLineHeight] = useState<string>('1.6');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  // References
  const editorRef = useRef<HTMLDivElement>(null);
  const savedRangeRef = useRef<Range | null>(null);

  // Helper to convert sections to initial HTML
  const sectionsToHtml = (sections: ArticleSection[]): string => {
    return sections
      .map((s) => {
        let block = '';
        if (s.title) {
          block += `<h2>${s.title}</h2>`;
        }
        s.paragraphs.forEach((p) => {
          block += `<p>${p}</p>`;
        });
        if (s.quote) {
          block += `<blockquote>${s.quote.text}</blockquote><p><em>— ${s.quote.author}, ${s.quote.role}</em></p>`;
        }
        if (s.highlightBox) {
          block += `<div style="background-color: rgba(131, 155, 100, 0.15); border: 1px solid rgba(131, 155, 100, 0.4); border-radius: 8px; padding: 12px 16px; margin: 16px 0;"><strong>${s.highlightBox.title}</strong><p>${s.highlightBox.content}</p></div>`;
        }
        return block;
      })
      .join('');
  };

  // Initialize document content
  useEffect(() => {
    if (!isOpen) return;

    if (articleToEdit) {
      setTitle(articleToEdit.title);
      setSubtitle(articleToEdit.subtitle);
      setChapeau(articleToEdit.chapeau);
      setCategory(articleToEdit.category);
      setCategoryTag(articleToEdit.categoryTag || 'Dossier Spécial');
      setAuthorName(articleToEdit.author.name);
      setAuthorRole(articleToEdit.author.role);
      setAuthorAvatar(articleToEdit.author.avatar);
      setPublishedAt(articleToEdit.publishedAt);
      setReadTimeMinutes(articleToEdit.readTimeMinutes);
      setHeroImage(articleToEdit.heroImage);
      setHeroImageCaption(articleToEdit.heroImageCaption);
      setHeroImageCredits(articleToEdit.heroImageCredits || 'Archives Six%');
      setIsPopular(!!articleToEdit.isPopular);
      setIsFeatured(!!articleToEdit.isFeatured);
      setKeyRevelations(articleToEdit.keyRevelations || []);

      const html =
        articleToEdit.contentHtml ||
        sectionsToHtml(articleToEdit.sections) ||
        '<p>Commencez la rédaction de l\'article ici...</p>';

      if (editorRef.current) {
        editorRef.current.innerHTML = html;
      }
    } else {
      setTitle('Nouvel article d\'investigation');
      setSubtitle('Sous-titre et angle d\'analyse de la rédaction');
      setChapeau('Pendant plusieurs mois d\'investigation, Six% a rassemblé des données et recoupé des témoignages indiscutables.');
      setCategory('Environnement');
      setCategoryTag('Article exclusif');
      setAuthorName('Cellule Investigation Six%');
      setAuthorRole('Journaliste d\'investigation');
      setAuthorAvatar(DEFAULT_AVATARS[0]);
      setPublishedAt(
        new Date().toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      );
      setReadTimeMinutes(7);
      setHeroImage(SUGGESTED_HERO_IMAGES[0].url);
      setHeroImageCaption('Photographie / document exclusif vérifié par Six%');
      setIsPopular(false);
      setIsFeatured(false);
      setKeyRevelations([
        'Révélation documentée issue des documents vérifiés.',
        'Preuve matérielle obtenue par la cellule d\'investigation.',
      ]);

      const initialHtml = `
        <h2>I. Les premières alertes documentées</h2>
        <p>Pendant plusieurs semaines, notre cellule a rassemblé des documents confidentiels et procédé à des vérifications minutieuses sur le terrain.</p>
        <p>Le recoupement des données met en lumière un décalage flagrant entre les déclarations officielles et la réalité opérationnelle observée.</p>
        <h2>II. Les preuves matérielles</h2>
        <p>Plusieurs pièces obtenues par nos journalistes confirment l'existence d'accords non divulgués et de prises de décision sous le sceau du secret.</p>
        <blockquote>« Ce que nous avons découvert dépasse tout ce qui avait été envisagé jusqu'ici. »</blockquote>
        <p>Face à ces éléments, la rédaction a sollicité les parties concernées afin d'obtenir leurs explications préalablement à cette publication.</p>
      `.trim();

      if (editorRef.current) {
        editorRef.current.innerHTML = initialHtml;
      }
    }
  }, [articleToEdit, isOpen]);

  // Selection helpers
  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      if (editorRef.current && editorRef.current.contains(range.commonAncestorContainer)) {
        savedRangeRef.current = range.cloneRange();
      }
    }
  };

  const restoreSelection = () => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    if (savedRangeRef.current) {
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(savedRangeRef.current);
      }
    }
  };

  // Update active formatting states on selection changes
  const updateToolbarStatus = () => {
    setIsBold(document.queryCommandState('bold'));
    setIsItalic(document.queryCommandState('italic'));
    setIsUnderline(document.queryCommandState('underline'));
    setIsStrikethrough(document.queryCommandState('strikeThrough'));
  };

  useEffect(() => {
    const handleSelection = () => {
      saveSelection();
      updateToolbarStatus();

      // Detect computed font size and line height at cursor/selection
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        const node = sel.anchorNode;
        const el = node?.nodeType === Node.ELEMENT_NODE ? (node as HTMLElement) : node?.parentElement;
        if (el && editorRef.current?.contains(el)) {
          const fs = window.getComputedStyle(el).fontSize;
          const parsed = parseInt(fs, 10);
          if (!isNaN(parsed) && parsed > 0) {
            setCurrentFontSize(parsed);
          }

          // Detect closest block line height
          const closestBlock = el.closest('p, h1, h2, h3, h4, h5, h6, blockquote, li, div') as HTMLElement;
          if (closestBlock && closestBlock.style.lineHeight) {
            setCurrentLineHeight(closestBlock.style.lineHeight);
          }
        }
      }
    };
    document.addEventListener('selectionchange', handleSelection);
    return () => document.removeEventListener('selectionchange', handleSelection);
  }, []);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.editor-dropdown-container')) {
        setShowHeadingsMenu(false);
        setShowColorPicker(false);
        setShowHighlightPicker(false);
        setShowFontSizeMenu(false);
        setShowLineHeightMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Text formatting commands
  const executeCmd = (command: string, value: string | undefined = undefined) => {
    restoreSelection();
    document.execCommand(command, false, value);
    saveSelection();
    updateToolbarStatus();
  };

  // Font size adjustment strictly scoped to selection (single letter, word, or sentence)
  const applyFontSizeToSelection = (sizePx: number) => {
    restoreSelection();
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
      // If nothing is selected, we only update the indicator number
      setCurrentFontSize(sizePx);
      return;
    }

    try {
      document.execCommand('styleWithCSS', false, 'false');
      document.execCommand('fontSize', false, '7');
      if (editorRef.current) {
        const fontElements = editorRef.current.querySelectorAll('font[size="7"]');
        if (fontElements.length > 0) {
          let lastSpan: HTMLElement | null = null;
          fontElements.forEach((fontEl) => {
            const span = document.createElement('span');
            span.style.fontSize = `${sizePx}px`;
            span.style.lineHeight = '1.35';
            span.innerHTML = fontEl.innerHTML;
            fontEl.parentNode?.replaceChild(span, fontEl);
            lastSpan = span;
          });
          if (lastSpan) {
            const newRange = document.createRange();
            newRange.selectNodeContents(lastSpan);
            const sel = window.getSelection();
            if (sel) {
              sel.removeAllRanges();
              sel.addRange(newRange);
            }
            savedRangeRef.current = newRange.cloneRange();
          }
        } else {
          // Fallback if execCommand didn't wrap into font[size="7"]
          const range = selection.getRangeAt(0);
          const span = document.createElement('span');
          span.style.fontSize = `${sizePx}px`;
          span.style.lineHeight = '1.35';
          span.appendChild(range.extractContents());
          range.insertNode(span);
          const newRange = document.createRange();
          newRange.selectNodeContents(span);
          selection.removeAllRanges();
          selection.addRange(newRange);
          savedRangeRef.current = newRange.cloneRange();
        }
      }
    } catch {
      const range = selection.getRangeAt(0);
      const span = document.createElement('span');
      span.style.fontSize = `${sizePx}px`;
      span.style.lineHeight = '1.35';
      span.appendChild(range.extractContents());
      range.insertNode(span);
    }

    saveSelection();
    setCurrentFontSize(sizePx);
    updateToolbarStatus();
  };

  const incrementFontSize = () => {
    const currentIndex = FONT_SIZES.indexOf(currentFontSize);
    const nextSize =
      currentIndex !== -1 && currentIndex < FONT_SIZES.length - 1
        ? FONT_SIZES[currentIndex + 1]
        : currentFontSize + 2;
    applyFontSizeToSelection(nextSize);
  };

  const decrementFontSize = () => {
    const currentIndex = FONT_SIZES.indexOf(currentFontSize);
    const prevSize =
      currentIndex > 0
        ? FONT_SIZES[currentIndex - 1]
        : Math.max(9, currentFontSize - 2);
    applyFontSizeToSelection(prevSize);
  };

  // Helper to find selected or active block elements
  const getActiveBlocks = (): HTMLElement[] => {
    restoreSelection();
    if (!editorRef.current) return [];
    const sel = window.getSelection();
    const blockTags = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'BLOCKQUOTE', 'LI', 'DIV'];

    if (!sel || sel.rangeCount === 0) {
      return Array.from(
        editorRef.current.querySelectorAll('p, h1, h2, h3, h4, h5, h6, blockquote, li')
      ) as HTMLElement[];
    }

    const range = sel.getRangeAt(0);
    const allBlocks = editorRef.current.querySelectorAll('p, h1, h2, h3, h4, h5, h6, blockquote, li');
    const matched: HTMLElement[] = [];

    allBlocks.forEach((b) => {
      try {
        if (sel.containsNode(b, true) || (range.intersectsNode && range.intersectsNode(b))) {
          matched.push(b as HTMLElement);
        }
      } catch {
        // Fallback for edge nodes
      }
    });

    if (matched.length === 0) {
      let node: Node | null = range.commonAncestorContainer;
      if (node.nodeType === Node.TEXT_NODE) node = node.parentNode;
      while (node && node !== editorRef.current) {
        if (node instanceof HTMLElement && blockTags.includes(node.tagName)) {
          matched.push(node);
          break;
        }
        node = node.parentNode;
      }
    }

    return matched.length > 0 ? matched : [editorRef.current];
  };

  // Line spacing (Interligne)
  const applyLineHeight = (lineHeightVal: string, applyToAll: boolean = false) => {
    restoreSelection();
    setCurrentLineHeight(lineHeightVal);

    if (!editorRef.current) return;

    if (applyToAll) {
      editorRef.current.style.lineHeight = lineHeightVal;
      const all = editorRef.current.querySelectorAll('p, h1, h2, h3, h4, h5, h6, blockquote, li, div');
      all.forEach((el) => {
        (el as HTMLElement).style.lineHeight = lineHeightVal;
      });
    } else {
      const blocks = getActiveBlocks();
      blocks.forEach((b) => {
        b.style.lineHeight = lineHeightVal;
      });
    }

    saveSelection();
    updateToolbarStatus();
  };

  // Paragraph spacing (Espacement avant / après)
  const toggleParagraphSpacing = (type: 'before' | 'after' | 'remove') => {
    restoreSelection();
    if (!editorRef.current) return;
    const blocks = getActiveBlocks();

    blocks.forEach((b) => {
      if (type === 'before') {
        b.style.marginTop = b.style.marginTop === '1.2em' ? '0' : '1.2em';
      } else if (type === 'after') {
        b.style.marginBottom = b.style.marginBottom === '1.2em' ? '0' : '1.2em';
      } else if (type === 'remove') {
        b.style.marginTop = '0';
        b.style.marginBottom = '0';
      }
    });

    saveSelection();
    updateToolbarStatus();
  };

  // Block format (Headings & Paragraphs)
  const formatBlock = (tag: string) => {
    restoreSelection();
    try {
      document.execCommand('formatBlock', false, tag);
    } catch {
      const cleanTag = tag.replace(/[<>]/g, '');
      document.execCommand('formatBlock', false, cleanTag);
    }
    setShowHeadingsMenu(false);
    saveSelection();
    updateToolbarStatus();
  };

  // Color actions
  const applyTextColor = (color: string) => {
    restoreSelection();
    try {
      document.execCommand('styleWithCSS', false, 'true');
    } catch {}
    executeCmd('foreColor', color);
    setShowColorPicker(false);
  };

  const applyHighlightColor = (color: string) => {
    restoreSelection();
    try {
      document.execCommand('styleWithCSS', false, 'true');
    } catch {}
    if (color === 'transparent') {
      executeCmd('removeFormat');
    } else {
      try {
        executeCmd('hiliteColor', color);
      } catch {
        executeCmd('backColor', color);
      }
    }
    setShowHighlightPicker(false);
  };

  // Special inserts
  const insertQuoteBlock = () => {
    const quoteHtml = `<blockquote style="margin: 24px 0; padding: 16px 20px; background: rgba(222, 216, 204, 0.5); border-left: 4px solid #839b64; border-radius: 8px; font-style: italic; font-size: 1.15rem; color: #3f241c;">« Insérez ici la citation d'un témoin ou d'un rapport clé »</blockquote><p><br></p>`;
    executeCmd('insertHTML', quoteHtml);
  };

  const insertHighlightBox = () => {
    const boxHtml = `<div style="background-color: rgba(131, 155, 100, 0.15); border: 1px solid rgba(131, 155, 100, 0.4); border-radius: 8px; padding: 14px 18px; margin: 20px 0;"><div style="font-weight: 800; text-transform: uppercase; font-size: 12px; color: #839b64; letter-spacing: 0.05em; margin-bottom: 4px;">⚠️ Point d'enquête clé</div><p style="margin: 0; font-size: 14px; color: #3f241c;">Détail de la révélation ou document vérifié par la rédaction.</p></div><p><br></p>`;
    executeCmd('insertHTML', boxHtml);
  };

  const insertDivider = () => {
    executeCmd('insertHorizontalRule');
  };

  const insertInlineImage = (url: string) => {
    const imgHtml = `<figure style="margin: 24px 0; text-align: center;"><img src="${url}" alt="Document d'investigation" style="width: 100%; border-radius: 12px; border: 1px solid rgba(63,36,28,0.2); box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);" /><figcaption style="margin-top: 8px; font-size: 12px; color: rgba(63,36,28,0.7); font-style: italic;">Document et épreuve recueillis par Six%</figcaption></figure><p><br></p>`;
    executeCmd('insertHTML', imgHtml);
  };

  // Word count & statistics
  const currentTextContent = editorRef.current?.innerText || '';
  const wordCount = useMemo(() => {
    const words = currentTextContent.trim().split(/\s+/).filter(Boolean);
    return words.length;
  }, [currentTextContent]);

  const estimatedReadingTime = useMemo(() => {
    return Math.max(1, Math.ceil(wordCount / 180));
  }, [wordCount]);

  // Convert HTML back to structured sections for backwards compatibility
  const parseHtmlToSections = (html: string): ArticleSection[] => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const sections: ArticleSection[] = [];
    let currentSecTitle: string | undefined = undefined;
    let currentParas: string[] = [];

    const flush = () => {
      if (currentParas.length > 0 || currentSecTitle) {
        sections.push({
          title: currentSecTitle,
          paragraphs: currentParas.length > 0 ? currentParas : ['Article vérifié par la rédaction.'],
        });
        currentSecTitle = undefined;
        currentParas = [];
      }
    };

    Array.from(doc.body.children).forEach((child) => {
      const tag = child.tagName.toLowerCase();
      if (tag === 'h1' || tag === 'h2' || tag === 'h3') {
        flush();
        currentSecTitle = child.textContent?.trim() || undefined;
      } else if (tag === 'p') {
        const text = child.innerHTML.trim();
        if (text && text !== '<br>') {
          currentParas.push(text);
        }
      } else if (tag === 'blockquote') {
        flush();
        sections.push({
          title: undefined,
          paragraphs: [child.innerHTML.trim()],
          quote: {
            text: child.textContent?.trim() || '',
            author: 'Source d\'investigation',
            role: 'Témoin clé',
          },
        });
      } else {
        const text = child.outerHTML.trim();
        if (text) {
          currentParas.push(text);
        }
      }
    });

    flush();

    return sections.length > 0
      ? sections
      : [
          {
            title: 'I. Le rapport d\'investigation',
            paragraphs: ['L\'article complet a été rédigé dans l\'éditeur enrichi de Six%.'],
          },
        ];
  };

  // Save handler
  const handleSave = () => {
    const finalTitle = title.trim() || articleToEdit?.title || 'Nouvel article d\'investigation';
    const finalSubtitle = subtitle.trim() || articleToEdit?.subtitle || 'Article approfondi par la rédaction de Six%';
    const finalChapeau = chapeau.trim() || articleToEdit?.chapeau || 'Enquête exclusive menée par la rédaction de Six%.';

    const html = editorRef.current ? editorRef.current.innerHTML : '';
    const parsedSections = parseHtmlToSections(html);

    const slug =
      articleToEdit?.slug ||
      finalTitle
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const updatedArticle: Article = {
      id: articleToEdit?.id || `art-custom-${Date.now()}`,
      slug,
      title: finalTitle,
      subtitle: finalSubtitle,
      chapeau: finalChapeau,
      category,
      categoryTag: categoryTag.trim() || 'Dossier Spécial',
      author: {
        name: authorName.trim() || 'Rédaction Six%',
        role: authorRole.trim() || 'Journaliste d\'investigation',
        avatar: authorAvatar,
      },
      publishedAt:
        publishedAt ||
        new Date().toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
      readTimeMinutes: estimatedReadingTime || readTimeMinutes || 6,
      heroImage: heroImage.trim() || (articleToEdit?.heroImage ?? SUGGESTED_HERO_IMAGES[0].url),
      heroImageCaption: heroImageCaption.trim() || 'Photographie / document exclusif',
      heroImageCredits: heroImageCredits.trim() || 'Archives Six%',
      isPopular,
      isFeatured,
      investigationDays: articleToEdit?.investigationDays || 120,
      leakedDocumentsCount: articleToEdit?.leakedDocumentsCount || 16,
      audioDuration: `${Math.round((estimatedReadingTime || readTimeMinutes) * 0.9)} min`,
      keyRevelations: keyRevelations.length > 0 ? keyRevelations : ['Révélation documentée par Six%.'],
      sections: parsedSections,
      contentHtml: html,
      sourcesCount: (keyRevelations.length || 2) * 3 + 4,
      verifiedFactChecks: (keyRevelations.length || 2) * 5 + 6,
    };

    onSave(updatedArticle);
    setSaveToast(true);
    setTimeout(() => {
      setSaveToast(false);
      onClose();
    }, 1200);
  };

  // Revelations add/remove
  const handleAddRevelation = () => {
    if (!newRevelation.trim()) return;
    setKeyRevelations([...keyRevelations, newRevelation.trim()]);
    setNewRevelation('');
  };

  const handleRemoveRevelation = (idx: number) => {
    setKeyRevelations(keyRevelations.filter((_, i) => i !== idx));
  };

  if (!isOpen) return null;

  return (
    <div
      id="google-docs-article-editor"
      className="fixed inset-0 z-50 flex flex-col bg-[#e8e6df] text-[#202124] overflow-hidden animate-in fade-in"
    >
      {/* GOOGLE DOCS TOP BAR */}
      <header className="bg-white border-b border-[#dadce0] px-4 py-2.5 flex items-center justify-between shadow-xs shrink-0 select-none">
        <div className="flex items-center gap-3">
          {/* Docs Icon */}
          <div className="w-10 h-10 rounded-xl bg-[#839b64] text-[#eae5da] flex items-center justify-center shadow-xs">
            <FileText className="w-5 h-5" />
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <h2
                className="font-bold text-base sm:text-lg text-[#202124] px-1 truncate max-w-xs sm:max-w-md md:max-w-xl select-none"
                title={title || 'Article sans titre'}
              >
                {title || 'Article sans titre'}
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#839b64]/15 text-[#839b64] font-bold uppercase whitespace-nowrap hidden sm:inline">
                Mode Éditeur
              </span>
            </div>

            {/* Menu Items (Google Docs style) */}
            <div className="hidden sm:flex items-center gap-3 text-xs text-[#5f6368] px-2 pt-0.5">
              <button
                type="button"
                onClick={handleSave}
                className="hover:text-[#202124] hover:bg-neutral-100 px-1.5 py-0.5 rounded transition-colors cursor-pointer"
              >
                Fichier (Enregistrer)
              </button>
              <button
                type="button"
                onClick={() => executeCmd('undo')}
                className="hover:text-[#202124] hover:bg-neutral-100 px-1.5 py-0.5 rounded transition-colors cursor-pointer"
              >
                Édition
              </button>
              <button
                type="button"
                onClick={() => setShowMetadataDrawer(true)}
                className="hover:text-[#202124] hover:bg-neutral-100 px-1.5 py-0.5 rounded transition-colors cursor-pointer"
              >
                Insertion
              </button>
              <button
                type="button"
                onClick={() => setViewMode(viewMode === 'edit' ? 'preview' : 'edit')}
                className="hover:text-[#202124] hover:bg-neutral-100 px-1.5 py-0.5 rounded transition-colors cursor-pointer text-[#839b64] font-bold"
              >
                {viewMode === 'edit' ? 'Aperçu Lecteur' : 'Retour Édition'}
              </button>
              <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-600" />
                Modifications synchronisées
              </span>
            </div>
          </div>
        </div>

        {/* Right Top Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Toggle Reader Preview */}
          <button
            type="button"
            onClick={() => setViewMode(viewMode === 'edit' ? 'preview' : 'edit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border ${
              viewMode === 'preview'
                ? 'bg-[#3f241c] text-[#eae5da] border-[#3f241c]'
                : 'bg-white text-[#3f241c] border-[#dadce0] hover:bg-neutral-50'
            }`}
            title="Basculer entre la feuille d'écriture et la vue finale du lecteur"
          >
            {viewMode === 'preview' ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">
              {viewMode === 'preview' ? 'Mode Rédaction' : 'Aperçu Lecteur'}
            </span>
          </button>

          {/* Metadata Drawer Toggle */}
          <button
            type="button"
            onClick={() => setShowMetadataDrawer(!showMetadataDrawer)}
            className="px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-[#3f241c] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-[#dadce0]"
            title="Configurer la couverture, le journaliste, la rubrique et les révélations clés"
          >
            <Settings className="w-3.5 h-3.5 text-[#839b64]" />
            <span className="hidden sm:inline">Métadonnées</span>
          </button>

          {/* Save & Publish Button */}
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-[#839b64] hover:bg-[#728956] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Enregistrer & Publier</span>
          </button>

          {/* Close Editor Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-neutral-200 flex items-center justify-center text-[#5f6368] hover:text-[#202124] transition-colors cursor-pointer"
            title="Quitter le studio"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* GOOGLE DOCS FORMATTING TOOLBAR */}
      {viewMode === 'edit' && (
        <div className="bg-[#edf2fa] border-b border-[#dadce0] px-3 sm:px-4 py-1.5 flex flex-wrap items-center gap-1 shadow-2xs shrink-0 select-none relative z-30 overflow-visible">
          {/* Undo / Redo */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => executeCmd('undo')}
            title="Annuler (Ctrl+Z)"
            className="p-1.5 rounded hover:bg-[#dadce0] text-[#444746] transition-colors cursor-pointer"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => executeCmd('redo')}
            title="Rétablir (Ctrl+Y)"
            className="p-1.5 rounded hover:bg-[#dadce0] text-[#444746] transition-colors cursor-pointer"
          >
            <Redo className="w-4 h-4" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => window.print()}
            title="Imprimer"
            className="p-1.5 rounded hover:bg-[#dadce0] text-[#444746] transition-colors cursor-pointer hidden sm:inline-flex"
          >
            <Printer className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-[#dadce0] mx-1 shrink-0" />

          {/* Heading / Style dropdown */}
          <div className="relative editor-dropdown-container">
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                setShowHeadingsMenu(!showHeadingsMenu);
                setShowColorPicker(false);
                setShowHighlightPicker(false);
                setShowFontSizeMenu(false);
              }}
              className="px-2.5 py-1 rounded hover:bg-[#dadce0] text-xs font-semibold text-[#444746] flex items-center gap-1.5 cursor-pointer whitespace-nowrap bg-white/70 border border-[#dadce0]/80 shadow-2xs"
            >
              <span>Styles de texte</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {showHeadingsMenu && (
              <div
                className="absolute top-full left-0 mt-1.5 w-60 bg-white rounded-xl shadow-2xl border border-neutral-200 py-1.5 z-50 animate-in fade-in"
              >
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => formatBlock('<p>')}
                  className="w-full px-3.5 py-2 text-left text-sm hover:bg-[#839b64]/10 hover:text-[#839b64] flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span className="font-normal">Texte normal</span>
                  <span className="text-[11px] text-neutral-400 font-mono">16px</span>
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => formatBlock('<h1>')}
                  className="w-full px-3.5 py-2 text-left text-lg font-black hover:bg-[#839b64]/10 hover:text-[#839b64] flex items-center justify-between border-t border-neutral-100 transition-colors cursor-pointer"
                >
                  <span>Titre 1</span>
                  <span className="text-[11px] text-neutral-400 font-mono">32px</span>
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => formatBlock('<h2>')}
                  className="w-full px-3.5 py-2 text-left text-base font-bold hover:bg-[#839b64]/10 hover:text-[#839b64] flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span>Titre 2 (Section)</span>
                  <span className="text-[11px] text-neutral-400 font-mono">24px</span>
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => formatBlock('<h3>')}
                  className="w-full px-3.5 py-2 text-left text-sm font-bold hover:bg-[#839b64]/10 hover:text-[#839b64] flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span>Titre 3 (Sous-section)</span>
                  <span className="text-[11px] text-neutral-400 font-mono">20px</span>
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => formatBlock('<blockquote>')}
                  className="w-full px-3.5 py-2 text-left text-sm italic hover:bg-[#839b64]/10 hover:text-[#839b64] border-t border-neutral-100 transition-colors cursor-pointer"
                >
                  <span>Citation d'enquête</span>
                </button>
              </div>
            )}
          </div>

          <div className="w-px h-5 bg-[#dadce0] mx-1 shrink-0" />

          {/* FONT SIZE CONTROLS (AGRANDIR / RÉDUIRE LA POLICE DU TEXTE SÉLECTIONNÉ) */}
          <div className="flex items-center bg-white rounded-lg border border-[#dadce0] px-1 py-0.5 shadow-2xs relative editor-dropdown-container">
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={decrementFontSize}
              title="Réduire la police du texte sélectionné (-)"
              className="w-6 h-6 rounded flex items-center justify-center hover:bg-neutral-100 text-[#444746] cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                setShowFontSizeMenu(!showFontSizeMenu);
                setShowHeadingsMenu(false);
                setShowColorPicker(false);
                setShowHighlightPicker(false);
              }}
              title="Choisir une taille de police"
              className="px-1.5 py-0.5 text-xs font-bold text-[#444746] hover:bg-neutral-100 rounded flex items-center gap-0.5 cursor-pointer min-w-[34px] justify-center"
            >
              <span>{currentFontSize}</span>
              <ChevronDown className="w-2.5 h-2.5 opacity-60" />
            </button>

            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={incrementFontSize}
              title="Agrandir la police du texte sélectionné (+)"
              className="w-6 h-6 rounded flex items-center justify-center hover:bg-neutral-100 text-[#444746] cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>

            {showFontSizeMenu && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 w-24 bg-white rounded-xl shadow-2xl border border-neutral-200 py-1.5 z-50 max-h-56 overflow-y-auto animate-in fade-in">
                {FONT_SIZES.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      applyFontSizeToSelection(sz);
                      setShowFontSizeMenu(false);
                    }}
                    className={`w-full px-2.5 py-1 text-center text-xs font-bold transition-colors cursor-pointer ${
                      currentFontSize === sz
                        ? 'bg-[#839b64] text-white'
                        : 'hover:bg-neutral-100 text-[#202124]'
                    }`}
                  >
                    {sz} px
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="w-px h-5 bg-[#dadce0] mx-1 shrink-0" />

          {/* BOLD, ITALIC, UNDERLINE, STRIKETHROUGH */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => executeCmd('bold')}
            title="Gras (Ctrl+B)"
            className={`p-1.5 rounded transition-colors cursor-pointer ${
              isBold ? 'bg-[#d3e3fd] text-[#0b57d0]' : 'hover:bg-[#dadce0] text-[#444746]'
            }`}
          >
            <Bold className="w-4 h-4" />
          </button>

          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => executeCmd('italic')}
            title="Italique (Ctrl+I)"
            className={`p-1.5 rounded transition-colors cursor-pointer ${
              isItalic ? 'bg-[#d3e3fd] text-[#0b57d0]' : 'hover:bg-[#dadce0] text-[#444746]'
            }`}
          >
            <Italic className="w-4 h-4" />
          </button>

          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => executeCmd('underline')}
            title="Souligner (Ctrl+U)"
            className={`p-1.5 rounded transition-colors cursor-pointer ${
              isUnderline ? 'bg-[#d3e3fd] text-[#0b57d0]' : 'hover:bg-[#dadce0] text-[#444746]'
            }`}
          >
            <Underline className="w-4 h-4" />
          </button>

          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => executeCmd('strikeThrough')}
            title="Barrer le texte"
            className={`p-1.5 rounded transition-colors cursor-pointer ${
              isStrikethrough ? 'bg-[#d3e3fd] text-[#0b57d0]' : 'hover:bg-[#dadce0] text-[#444746]'
            }`}
          >
            <Strikethrough className="w-4 h-4" />
          </button>

          {/* Text Color Picker */}
          <div className="relative editor-dropdown-container">
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                setShowColorPicker(!showColorPicker);
                setShowHighlightPicker(false);
                setShowHeadingsMenu(false);
                setShowFontSizeMenu(false);
              }}
              title="Couleur du texte"
              className={`p-1.5 rounded transition-colors cursor-pointer flex items-center gap-0.5 ${
                showColorPicker ? 'bg-[#d3e3fd] text-[#0b57d0]' : 'hover:bg-[#dadce0] text-[#444746]'
              }`}
            >
              <Palette className="w-4 h-4" />
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {showColorPicker && (
              <div className="absolute top-full left-0 mt-1.5 bg-white rounded-xl shadow-2xl border border-neutral-200 p-3 z-50 w-52 animate-in fade-in">
                <span className="text-[10px] font-mono font-bold uppercase text-neutral-500 block mb-2">
                  Couleur du texte
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {TEXT_COLORS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => applyTextColor(c.value)}
                      title={c.label}
                      className="w-9 h-9 rounded-lg border-2 border-neutral-200 flex items-center justify-center cursor-pointer hover:scale-110 hover:border-[#839b64] transition-all shadow-xs"
                      style={{ backgroundColor: c.value }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Highlight Color Picker */}
          <div className="relative editor-dropdown-container">
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                setShowHighlightPicker(!showHighlightPicker);
                setShowColorPicker(false);
                setShowHeadingsMenu(false);
                setShowFontSizeMenu(false);
              }}
              title="Couleur de surlignage"
              className={`p-1.5 rounded transition-colors cursor-pointer flex items-center gap-0.5 ${
                showHighlightPicker ? 'bg-[#d3e3fd] text-[#0b57d0]' : 'hover:bg-[#dadce0] text-[#444746]'
              }`}
            >
              <Highlighter className="w-4 h-4" />
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {showHighlightPicker && (
              <div className="absolute top-full left-0 mt-1.5 bg-white rounded-xl shadow-2xl border border-neutral-200 p-3 z-50 w-60 animate-in fade-in">
                <span className="text-[10px] font-mono font-bold uppercase text-neutral-500 block mb-2">
                  Couleur de surlignage
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {HIGHLIGHT_COLORS.map((h) => (
                    <button
                      key={h.value}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => applyHighlightColor(h.value)}
                      title={h.label}
                      className="h-8 rounded-lg border border-neutral-300 flex items-center justify-center cursor-pointer hover:scale-105 hover:border-[#839b64] transition-all text-[11px] font-bold shadow-xs text-[#202124]"
                      style={{ backgroundColor: h.value }}
                    >
                      {h.value === 'transparent' ? 'Aucun' : h.label.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="w-px h-5 bg-[#dadce0] mx-1 shrink-0" />

          {/* Alignment */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => executeCmd('justifyLeft')}
            title="Aligner à gauche"
            className="p-1.5 rounded hover:bg-[#dadce0] text-[#444746] cursor-pointer"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => executeCmd('justifyCenter')}
            title="Centrer"
            className="p-1.5 rounded hover:bg-[#dadce0] text-[#444746] cursor-pointer"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => executeCmd('justifyRight')}
            title="Aligner à droite"
            className="p-1.5 rounded hover:bg-[#dadce0] text-[#444746] cursor-pointer hidden sm:inline-flex"
          >
            <AlignRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => executeCmd('justifyFull')}
            title="Justifier le texte"
            className="p-1.5 rounded hover:bg-[#dadce0] text-[#444746] cursor-pointer"
          >
            <AlignJustify className="w-4 h-4" />
          </button>

          {/* Line Spacing / Interligne */}
          <div className="relative editor-dropdown-container">
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                setShowLineHeightMenu(!showLineHeightMenu);
                setShowColorPicker(false);
                setShowHighlightPicker(false);
                setShowHeadingsMenu(false);
                setShowFontSizeMenu(false);
              }}
              title="Interligne et espacement des paragraphes"
              className={`px-2 py-1 rounded transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold ${
                showLineHeightMenu
                  ? 'bg-[#d3e3fd] text-[#0b57d0]'
                  : 'hover:bg-[#dadce0] text-[#444746]'
              }`}
            >
              <MoveVertical className="w-4 h-4" />
              <span className="text-[11px] font-mono hidden sm:inline">{currentLineHeight}</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {showLineHeightMenu && (
              <div className="absolute top-full left-0 mt-1.5 bg-white rounded-xl shadow-2xl border border-neutral-200 py-2 z-50 w-64 animate-in fade-in select-none">
                <div className="px-3 pb-1.5 mb-1 border-b border-neutral-100 flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase text-neutral-500">
                    Interligne
                  </span>
                  <span className="text-[10px] text-[#839b64] font-bold">Actuel : {currentLineHeight}</span>
                </div>

                <div className="py-1">
                  {LINE_HEIGHTS.map((lh) => (
                    <button
                      key={lh.value}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        applyLineHeight(lh.value, false);
                        setShowLineHeightMenu(false);
                      }}
                      className={`w-full px-3.5 py-1.5 text-left text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                        currentLineHeight === lh.value
                          ? 'bg-[#839b64]/10 text-[#839b64] font-bold'
                          : 'hover:bg-neutral-100 text-[#202124]'
                      }`}
                    >
                      <span>{lh.label}</span>
                      {currentLineHeight === lh.value && <Check className="w-3.5 h-3.5 text-[#839b64]" />}
                    </button>
                  ))}
                </div>

                <div className="pt-1.5 pb-1 border-t border-neutral-100 px-2">
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      applyLineHeight(currentLineHeight, true);
                      setShowLineHeightMenu(false);
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs font-semibold text-[#839b64] hover:bg-[#839b64]/10 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Appliquer cet interligne à tout l'article</span>
                  </button>
                </div>

                <div className="pt-2 border-t border-neutral-100 px-2 space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-neutral-400 block px-1.5">
                    Espacement des paragraphes
                  </span>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      toggleParagraphSpacing('before');
                      setShowLineHeightMenu(false);
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs text-[#444746] hover:bg-neutral-100 transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <span>Espace avant le paragraphe</span>
                  </button>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      toggleParagraphSpacing('after');
                      setShowLineHeightMenu(false);
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs text-[#444746] hover:bg-neutral-100 transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <span>Espace après le paragraphe</span>
                  </button>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      toggleParagraphSpacing('remove');
                      setShowLineHeightMenu(false);
                    }}
                    className="w-full px-2.5 py-1 rounded-lg text-left text-[11px] text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    Supprimer les espacements
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="w-px h-5 bg-[#dadce0] mx-1 shrink-0" />

          {/* Lists */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => executeCmd('insertUnorderedList')}
            title="Liste à puces"
            className="p-1.5 rounded hover:bg-[#dadce0] text-[#444746] cursor-pointer"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => executeCmd('insertOrderedList')}
            title="Liste numérotée"
            className="p-1.5 rounded hover:bg-[#dadce0] text-[#444746] cursor-pointer"
          >
            <ListOrdered className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-[#dadce0] mx-1 shrink-0" />

          {/* Insert Special Components */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={insertQuoteBlock}
            title="Insérer un bloc citation"
            className="px-2 py-1 rounded hover:bg-[#dadce0] text-xs font-semibold text-[#444746] flex items-center gap-1 cursor-pointer"
          >
            <Quote className="w-3.5 h-3.5 text-[#839b64]" />
            <span className="hidden md:inline">Citation</span>
          </button>

          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={insertHighlightBox}
            title="Insérer un encadré d'alerte ou révélation"
            className="px-2 py-1 rounded hover:bg-[#dadce0] text-xs font-semibold text-[#444746] flex items-center gap-1 cursor-pointer"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-[#839b64]" />
            <span className="hidden md:inline">Encadré clé</span>
          </button>

          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              setMediaPickerTarget('inline');
              setIsMediaPickerOpen(true);
            }}
            title="Insérer une image depuis la médiathèque"
            className="px-2 py-1 rounded hover:bg-[#dadce0] text-xs font-semibold text-[#444746] flex items-center gap-1 cursor-pointer"
          >
            <ImageIcon className="w-3.5 h-3.5 text-[#839b64]" />
            <span className="hidden md:inline">Image</span>
          </button>

          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={insertDivider}
            title="Insérer une ligne de séparation"
            className="px-2 py-1 rounded hover:bg-[#dadce0] text-xs font-semibold text-[#444746] flex items-center gap-1 cursor-pointer hidden lg:inline-flex"
          >
            <Minus className="w-3.5 h-3.5" />
            <span>Séparateur</span>
          </button>

          {/* Clear format */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => executeCmd('removeFormat')}
            title="Effacer la mise en forme"
            className="p-1.5 rounded hover:bg-[#dadce0] text-[#444746] cursor-pointer ml-auto"
          >
            <span className="text-xs font-mono font-bold">Tx</span>
          </button>

          {/* Word Count Indicator */}
          <div className="hidden xl:flex items-center gap-1 text-[11px] font-mono text-[#5f6368] px-2 py-0.5 bg-white rounded border border-[#dadce0] whitespace-nowrap">
            <span>{wordCount} mots</span>
            <span>•</span>
            <span>~{estimatedReadingTime} min</span>
          </div>
        </div>
      )}

      {/* MAIN BODY: WORKSPACE CANVAS & SIDEBAR */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* DOCUMENT PAPER CANVAS (Google Docs Page) */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-8 flex justify-center items-start bg-[#e8e6df]">
          {viewMode === 'edit' ? (
            <div className="w-full max-w-[850px] bg-white rounded-xs shadow-md border border-[#c7c7c7] min-h-[1050px] h-auto p-8 sm:p-14 md:p-16 flex flex-col text-[#202124] relative mb-16 shrink-0 animate-in fade-in duration-200">
              {/* Discrete Document Info Bar */}
              <div className="pb-4 mb-8 border-b border-neutral-200 flex items-center justify-between text-xs text-neutral-400 font-mono select-none">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-sans font-bold text-neutral-800 text-sm truncate max-w-xs sm:max-w-md">
                    {title || 'Article sans titre'}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#839b64]/10 text-[#839b64] font-bold font-sans uppercase shrink-0">
                    Corps de l'article
                  </span>
                </div>
                <span className="text-[11px] text-neutral-400 hidden md:inline">
                  En-tête, sous-titre & chapô gérés via « Modifier les options »
                </span>
              </div>

              {/* MAIN CONTENT EDITABLE CANVAS */}
              <div className="relative w-full flex-1 min-h-[750px] h-auto">
                <div
                  ref={editorRef}
                  contentEditable
                  suppressContentEditableWarning
                  onInput={updateToolbarStatus}
                  onKeyUp={updateToolbarStatus}
                  onMouseUp={updateToolbarStatus}
                  className="docs-editor-content focus:outline-none min-h-[750px] h-auto w-full text-base leading-relaxed text-[#202124] break-words"
                />
              </div>
            </div>
          ) : (
            /* LIVE READER PREVIEW MODE */
            <div className="w-full max-w-3xl bg-[#eae5da] rounded-2xl p-6 sm:p-12 shadow-xl border border-[#3f241c]/20 text-[#3f241c] animate-in fade-in mb-16 shrink-0">
              <div className="mb-4 flex items-center gap-3 text-xs font-mono text-[#3f241c]/80">
                <span className="px-3 py-1 rounded bg-[#839b64] text-[#eae5da] font-bold uppercase">
                  {categoryTag}
                </span>
                <span>{publishedAt}</span>
                <span>•</span>
                <span>{estimatedReadingTime} min de lecture</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 text-[#3f241c]">
                {title}
              </h1>
              <p className="text-xl text-[#3f241c]/85 font-medium leading-relaxed mb-6">
                {subtitle}
              </p>

              {heroImage && (
                <div className="mb-8 rounded-2xl overflow-hidden border border-[#3f241c]/20 shadow-md">
                  <img src={heroImage} alt={title} className="w-full max-h-96 object-cover" />
                  <div className="p-3 bg-[#ded8cc]/50 text-xs text-[#3f241c]/70 italic flex flex-wrap items-center justify-between gap-2">
                    <span>{heroImageCaption || 'Photographie d\'investigation'}</span>
                    <span className="font-mono text-[10px] uppercase text-[#3f241c]/60">
                      Crédits : {heroImageCredits || 'Archives Six%'}
                    </span>
                  </div>
                </div>
              )}

              <div className="my-6 p-5 rounded-xl bg-[#ded8cc]/50 border-l-4 border-[#839b64] italic text-lg leading-relaxed">
                {chapeau}
              </div>

              <div
                className="article-rich-content space-y-6 text-[#3f241c] leading-relaxed text-justify"
                dangerouslySetInnerHTML={{
                  __html: editorRef.current ? editorRef.current.innerHTML : '',
                }}
              />
            </div>
          )}
        </div>

        {/* METADATA SLIDE-IN DRAWER */}
        {showMetadataDrawer && (
          <aside className="w-80 sm:w-96 bg-white border-l border-[#dadce0] p-6 shadow-2xl overflow-y-auto shrink-0 animate-in slide-in-from-right duration-200 z-30 flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-[#839b64]" />
                  <h3 className="font-bold text-sm text-[#202124]">
                    Paramètres & Visuels
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowMetadataDrawer(false)}
                  className="w-7 h-7 rounded hover:bg-neutral-100 flex items-center justify-center text-neutral-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Rubrique & Catégorie */}
              <div>
                <label className="block text-[11px] font-mono font-bold uppercase text-neutral-500 mb-1">
                  Catégorie thématique
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-semibold outline-none focus:border-[#839b64]"
                >
                  {categories.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold uppercase text-neutral-500 mb-1">
                  Tag de rubrique
                </label>
                <input
                  type="text"
                  value={categoryTag}
                  onChange={(e) => setCategoryTag(e.target.value)}
                  placeholder="ex. Dossier Spécial"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-xs outline-none focus:border-[#839b64]"
                />
              </div>

              {/* Hero Image */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-mono font-bold uppercase text-neutral-500">
                    Image de couverture
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setMediaPickerTarget('hero');
                      setIsMediaPickerOpen(true);
                    }}
                    className="text-[11px] text-[#839b64] font-bold hover:underline cursor-pointer"
                  >
                    Médiathèque
                  </button>
                </div>
                <input
                  type="url"
                  value={heroImage}
                  onChange={(e) => setHeroImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-1.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-mono outline-none"
                />
                <input
                  type="text"
                  value={heroImageCaption}
                  onChange={(e) => setHeroImageCaption(e.target.value)}
                  placeholder="Légende de la photo..."
                  className="w-full mt-2 px-3 py-1.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs outline-none focus:border-[#839b64]"
                />
                <input
                  type="text"
                  value={heroImageCredits}
                  onChange={(e) => setHeroImageCredits(e.target.value)}
                  placeholder="Crédits photo (ex. Archives Six%, AFP...)"
                  className="w-full mt-2 px-3 py-1.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-mono outline-none focus:border-[#839b64]"
                />
                <div className="flex items-center gap-1 flex-wrap pt-1">
                  {['Archives Six%', 'Enquête Six%', 'AFP', 'Reuters'].map((cr) => (
                    <button
                      key={cr}
                      type="button"
                      onClick={() => setHeroImageCredits(cr)}
                      className={`px-1.5 py-0.5 rounded text-[9px] font-mono border transition-colors cursor-pointer ${
                        heroImageCredits === cr
                          ? 'bg-[#3f241c] text-white border-[#3f241c]'
                          : 'bg-neutral-100 text-neutral-600 border-neutral-200 hover:border-[#839b64]'
                      }`}
                    >
                      {cr}
                    </button>
                  ))}
                </div>
              </div>

              {/* Journalist Profile */}
              <div className="space-y-2 pt-2 border-t border-neutral-200">
                <label className="block text-[11px] font-mono font-bold uppercase text-neutral-500">
                  Journaliste / Auteur
                </label>
                <div className="flex items-center gap-3">
                  <img
                    src={authorAvatar}
                    alt={authorName}
                    className="w-10 h-10 rounded-full object-cover border border-[#839b64] shrink-0"
                  />
                  <div className="flex-1 space-y-1">
                    <input
                      type="text"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="Nom du journaliste..."
                      className="w-full px-2.5 py-1 rounded-lg bg-neutral-50 border border-neutral-200 text-xs font-bold outline-none"
                    />
                    <input
                      type="text"
                      value={authorRole}
                      onChange={(e) => setAuthorRole(e.target.value)}
                      placeholder="Rôle / Titre..."
                      className="w-full px-2.5 py-1 rounded-lg bg-neutral-50 border border-neutral-200 text-[11px] text-neutral-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Key Revelations */}
              <div className="pt-2 border-t border-neutral-200">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-mono font-bold uppercase text-neutral-500">
                    Révélations clés ({keyRevelations.length})
                  </label>
                </div>
                <div className="space-y-1.5 max-h-36 overflow-y-auto mb-2">
                  {keyRevelations.map((rev, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-2 p-2 rounded-lg bg-neutral-50 border border-neutral-200 text-xs"
                    >
                      <span className="truncate flex-1 text-neutral-700">{rev}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveRevelation(idx)}
                        className="text-red-600 hover:text-red-800 p-0.5"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={newRevelation}
                    onChange={(e) => setNewRevelation(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddRevelation();
                      }
                    }}
                    placeholder="Ajouter une révélation..."
                    className="flex-1 px-2.5 py-1 rounded-lg bg-neutral-50 border border-neutral-200 text-xs outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddRevelation}
                    className="px-2.5 py-1 bg-[#3f241c] text-white rounded-lg text-xs font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Visibility checkboxes */}
              <div className="space-y-2 pt-2 border-t border-neutral-200">
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="accent-[#839b64] w-4 h-4"
                  />
                  <span>À la une de la catégorie</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPopular}
                    onChange={(e) => setIsPopular(e.target.checked)}
                    className="accent-[#839b64] w-4 h-4"
                  />
                  <span>Carrousel 3D populaire</span>
                </label>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowMetadataDrawer(false)}
              className="mt-6 w-full py-2 rounded-xl bg-[#839b64] text-white text-xs font-bold hover:bg-[#728956] transition-colors cursor-pointer"
            >
              Fermer le panneau
            </button>
          </aside>
        )}
      </div>

      {/* SUCCESS TOAST */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#3f241c] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#839b64] flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
          <div className="w-8 h-8 rounded-full bg-[#839b64] flex items-center justify-center">
            <Check className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-xs font-bold">Article enregistré avec succès !</p>
            <p className="text-[11px] text-[#eae5da]/70">
              Toutes les mises en forme riches sont publiées.
            </p>
          </div>
        </div>
      )}

      {/* MEDIA LIBRARY IMAGE PICKER MODAL */}
      {isMediaPickerOpen && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 sm:p-6 bg-[#3f241c]/80 backdrop-blur-xs animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsMediaPickerOpen(false);
          }}
        >
          <div className="bg-[#eae5da] w-full max-w-4xl rounded-2xl border-2 border-[#3f241c] shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
            <div className="p-4 bg-[#3f241c] text-[#eae5da] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-[#839b64]" />
                <div>
                  <h3 className="font-bold text-sm">
                    Médiathèque • Choisir une image
                  </h3>
                  <p className="text-[11px] font-mono text-[#839b64]">
                    Sélectionnez une image ou téléversez un nouveau visuel
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMediaPickerOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center cursor-pointer text-[#eae5da]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              <MediaLibrary
                articles={[]}
                isPickerMode={true}
                onSelectImage={(url) => {
                  if (mediaPickerTarget === 'hero') {
                    setHeroImage(url);
                  } else if (mediaPickerTarget === 'author') {
                    setAuthorAvatar(url);
                  } else if (mediaPickerTarget === 'inline') {
                    insertInlineImage(url);
                  }
                  setIsMediaPickerOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
