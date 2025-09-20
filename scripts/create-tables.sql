-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  thumbnail TEXT,
  level TEXT NOT NULL CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
  students INTEGER DEFAULT 0,
  duration TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chapters table
CREATE TABLE IF NOT EXISTS chapters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  video_url TEXT NOT NULL,
  duration TEXT NOT NULL,
  order_number INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chapters_course_id ON chapters(course_id);
CREATE INDEX IF NOT EXISTS idx_chapters_order ON chapters(course_id, order_number);

-- Insert sample data
INSERT INTO courses (id, title, description, thumbnail, level, students, duration) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'AutoCAD Fundamentals', 'Master the basics of 2D drafting and design with hands-on projects', '/placeholder.svg?height=300&width=500&text=AutoCAD+Fundamentals', 'Beginner', 1234, '6 hours'),
('550e8400-e29b-41d4-a716-446655440002', '3D Modeling Mastery', 'Advanced 3D modeling techniques and professional workflows', '/placeholder.svg?height=300&width=500&text=3D+Modeling', 'Intermediate', 856, '8 hours')
ON CONFLICT (id) DO NOTHING;

INSERT INTO chapters (course_id, title, description, video_url, duration, order_number) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Getting Started with AutoCAD', 'Introduction to the AutoCAD interface and basic navigation', 'https://www.youtube.com/embed/dQw4w9WgXcQ', '15 min', 1),
('550e8400-e29b-41d4-a716-446655440001', 'Basic Drawing Tools', 'Learn to use lines, circles, rectangles and other basic drawing tools', 'https://www.youtube.com/embed/dQw4w9WgXcQ', '20 min', 2),
('550e8400-e29b-41d4-a716-446655440001', 'Layers and Properties', 'Understanding layers, colors, and line types', 'https://www.youtube.com/embed/dQw4w9WgXcQ', '18 min', 3),
('550e8400-e29b-41d4-a716-446655440002', '3D Workspace Setup', 'Setting up your workspace for 3D modeling', 'https://www.youtube.com/embed/dQw4w9WgXcQ', '12 min', 1),
('550e8400-e29b-41d4-a716-446655440002', 'Basic 3D Shapes', 'Creating and manipulating basic 3D primitives', 'https://www.youtube.com/embed/dQw4w9WgXcQ', '22 min', 2)
ON CONFLICT DO NOTHING;
